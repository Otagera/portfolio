---
title: "Comics and Couch: Two Self-Hosted Media Management Apps"
date: "2026-11-18"
readTime: "17 min"
summary: "A Komga sidecar that treats Google Drive as the source of truth and the server's disk as a cache, and a what-to-watch app built on the same skeleton two months later in a day."
tags: ["typescript", "self-hosting", "komga", "sqlite", "llm", "coolify", "tanstack-start"]
---

This is the golden age of personal software.

Well if I was like a CEO of a AI company those are the kind of things i would say often, but alas I am not. But that doesn't make it any less true. I made what I considered to be 2 cool very personal and niche web applications with the help of AI and I decided to yap about it here. So enjoy.

They are generically called Comics and Couch.

First, [Comics](https://github.com/Otagera/comics) which sits next to [Komga](https://komga.org) and it manages a comic archive that lives on Google Drive: to show what's in it, what I've read, what I want, and what's worth keeping on the server's limited disk. Secondly, [Couch](https://github.com/Otagera/couch) does the same job for TV and film: it reads what I've watched from Simkl and Letterboxd, knows which services I pay for and possibly what's on my drives, and suggests what to watch next.

When working on Comics earlier in September it took a couple of days, plus a few rounds of fixes after because I was still refining the idea. So when it came to back to Couch in November it took just one day (it had been through several versions earlier in the year without reaching this form), because by then the skeleton existed: a TypeScript core over SQLite with almost no dependencies, a TanStack Start UI, a shared theme, and a deploy pipeline I'd already fought with. 
The essence of this post is to covers both applications, and the patterns underneath them.

---

## Comics

### The problem

If we would call it a problem. The thing is I have a digital comic archive that I have backed up on Google Drive. It's a bit large (about 43.3 GB), and the server that reads it is a small VPS(link to article on setting up the vps) with a root disk that was already uncomfortably full (pushing 90%). Before this, I tried using a script (`cxsync`) that pulled files from Drive into [ComiXed](https://comixed.org), evicting old ones when space ran low. It worked, but ComiXed records *that* you read a comic, never *when*, so eviction had to guess from file access times. Plus ComiXed's UI also felt clunky and dated, and while researching alternatives I learned about [OPDS](https://opds.io), the standard feed format for digital libraries (digital books and manga can also be served with it, If I read a lot of digital books I would have expanded this to include that too, but I unfortuanaly don't read as much books as I should and in the little I do read I don't enjoy digital reading), which meant I could pick a server and a reader app separately.

So I moved to Komga, which serves the library: I read in its web reader, or on my phone through [CDisplayEx](https://www.cdisplayex.com) over OPDS. ow with CDisplayEx, to be honest it was a bit diffuclt picking a good app because they all kind of suck to be honest. If you have not read a comic in you phone before let me try to explain why, digital comics unlike unlike books cannot be broken up say mid-page because an entire page is important, infact sometimes 2 pages and trust me in the hands of very good artists and storytellers it can be a very good use of the page, so you can imagine how it would be difficult to show the on a "small" 6.4-inch display on a phone. So when I went looking I needed an app that would reading into OPDS and then feed back to it and display what I am reading well. There were other issues with pricing and testing an app afterwards etc, but the by some strock of luck I realised that the app i was already using - CDisplayEx had a pro tier that used OPDS well so I just paid for it (it cost me ₦1,850.00).

Once that was settled, I wrote a sidecar around Komga with a clear split:

- **Komga** serves and reads comics, and owns metadata because that is what the project is about and makes easy.
- **The sidecar** catalogues the Drive archive, tracks reading, holds a wishlist, decides what's cached on disk (very important), and syncs with my list on Notion.
- **Google Drive** is the source of truth, since I already pay for Google One storage for my photos. The local volume is just a cache over it. (The obvious caveat: a DMCA notice could make Drive a lot less reliable as a source of truth someday.)

The sidecar never reads a comic and never edits metadata. Keeping that boundary sharp is what keeps the application small.

### How to contact the Drive

The sidecar's catalogue UI reads SQLite only (thats all you need for this kind of application). Drive is contacted in exactly one module, on an hourly cron plus a manual refresh button, so browsing can never burn Drive API quota however the UI behaves. Listing and copying go through `rclone`. (rclone deserves its own post someday. I also use it to back up my machine to Google Drive, and it's one of the simplest, most intuitive tools I know.)

The schema is ID-first. Every comic gets a stable internal id the first time it's seen, and is re-identified on later refreshes by its Drive file id, which survives renames and moves. Path is only a fallback. Columns for `komga_id` and `notion_page_id` were nullable from day one, so the Notion sync I added later was a column fill, not a migration.

### Fetching without Komga

Fetching a title from Drive keeps cxsync's shape, with ComiXed's three-call import replaced by a Komga scan:

```text
budget check -> evict if needed -> rclone into staging -> verify size
  -> atomic rename into the library -> Komga scan -> confirm the book exists
```

Two details to note. Staging lives on the same filesystem as the library, so the final move is a `rename` and Komga's scanner never sees a partially written archive. And the destination folder is named for the *parsed* series, not Drive's folder, because Komga derives series from directory structure, and my Drive folders mix publishers, catch-alls and actual series.

### Keeping it fresh

Space is limited, so something we came to the conclusion that some files have to go from time to time to time. Thankfully Komga exposes `readDate` and progress per book, so eviction can rank by what I've actually done rather than just file metadata:

```typescript
/** Higher score = evict sooner. */
const BASE_SCORE: Record<string, number> = {
  abandoned: 1000,
  finished: 800,
  unread: 500,
  reading: 100,
  want: 400,
}
```

Abandoned goes first, then finished, then fetched-but-never-opened. In-progress books are protected, more strongly the more recently they were read. Pinned books are never evicted. Anything fetched in the last few hours is excluded outright, so fetching one book can't immediately evict the one you fetched before it.

Deleting is safe because Drive holds the master, and the Komga library has `emptyTrashAfterScan` off: Komga keeps the book's row and read history and just marks it unavailable. Re-fetching brings it back with progress intact.

The header in the catalogue UI carries a capacity meter for quick glance: a gradient fill with a hard tick at the eviction budget, so "how full" and "how full am I allowed to be" are never the same shape. The detail view warns when a fetch would push past budget.

![The comics catalogue: cover grid with the capacity meter in the header](/writing/comics-and-couch/comics-grid.webp)

### Parsing filenames

Comic filenames are usually a mess, especially given where mine come from (*wink*), and the parser kept finding new cases to deal with in real data:

- `History of the Marvel Universe 001-006` is one release containing issues 1 to 6, not a series called "...001-006". Ranges are now stored as the issue.
- `DC/The Man of Steel 01-06 (1986)/` holds six issue files. The trailing number on each file was being kept as part of the series name, so one six-issue story became six series. The number is now stripped *only for comparing against the folder*, so a title that genuinely ends in a number, like *Top 10*, keeps it.
- Some Marvel titles were plain `.zip` rather than `.cbz`, and my port had narrowed the extension list. Komga reads a bare `.zip` exactly like a `.cbz`, so they're indexed now.

### Covers

Most of the grid was blank at first deployment, because only cached comics had art (Komga generates thumbnails from local files). I didn't want to ask a third-party catalogue what a book looks like: doing matching on a scene-release filename is the same fuzzy match that once put *Dark Victory* on two different Batman rows.

The cover is already inside the archive on Drive. So what was done in the sidecar is to fetch only the head of each file (4 MB, escalating to 16 MB) and list it with `bsdtar`, which reads RAR and ZIP alike. On a 590 MB *Watchmen* `.cbr`, 4 MB in was enough to get a real JPEG out. Something we had to take note of is that archive order isn't neccesarily page order, so it takes the lowest-numbered image present, and checks the bytes for an image signature before writing.

Getting there took three bugs in a row:

1. `bsdtar` reports "Truncated input file" and exits 1 on a deliberately truncated archive, which is exactly what it's being handed, while still writing the entry. `promisify(execFile)` rejects on a non-zero exit, so good covers were being thrown away. Output is now kept whenever there is any.
2. Covers came out at 1-3 MB each. Eighty of those in a grid is hundreds of megabytes, so they're resized to roughly the tile size with ImageMagick.
3. The resize silently did nothing, because Alpine's `imagemagick` package ships without a JPEG decoder ("no decode delegate for this image format"). The fallback that keeps the original cover hid the error. Adding `imagemagick-jpeg` fixed it. (There is no `imagemagick-png`; PNG is built in. The build told me that the hard way.)

Lastly, titles with no art yet get a hand-drawn card from [drawably](https://www.npmjs.com/package/drawably) seeded from the comic id, so it's stable across renders. Fetching swaps the sketch for the real thumbnail, which makes the status readable before you read any label.

![Remote titles as hand-drawn cards next to fetched covers](/writing/comics-and-couch/comics-sketch-cards.webp)

The same truncated-head listing also catches **bundles**: zips that hold a folder of separate issue archives rather than pages. Komga can't read those (`ERR_1006`), so the sidecar flags them from the listing and unpacks them into their own directory on fetch. Each bundle gets its own directory so that evicting one is still a single recursive delete.

### Syncing to a Notion log

Before building this I kept (still do) a hand-written log in Notion (as one does) for keeping track of what I am reading and what I want to read that goes back years before this sidecar existed. I wanted to keep it updated just for the sake of it, so the sync to it is one-way and deliberately timid:

- It writes exactly four properties: Name (on creation only), Type, Status, Completed Date. No code path builds a payload with my Author, Rating or Description fields.
- **It never moves a row backwards.** The first real sync turned four "Done" rows into "Not started", because the sidecar had no history for comics I'd read years ago, or on paper. Status now only moves forward along *Not bought → Not started → In progress → Done*.
- **It tracks works, not files.** Three volumes of one series are one row; reading *Lost Girls* is one act, not three. Unnumbered collected editions stay separate, because this archive has two different Batman collections told apart only by subtitle.
- **It only creates rows for things I've started.** The log records reading, not an inventory of the disk.
- **Fuzzy matches go to a human.** Auto-linking needs a score of 0.95. "Batman" scores exactly 0.90 against a different Batman book, and linked itself twice before I raised the bar. Anything softer shows up on a confirmation screen, and rejections are remembered so the same wrong suggestion never comes back.

### Deployment

The stack is one compose file deployed through [Coolify](https://coolify.io): push to `main`, GitHub Actions tests and builds the image, pushes it to GHCR, then calls Coolify's deploy webhook. Getting there took most of a day. (I want to streamline this process and write that up too, because I think it's an easy win.)

- **Building on the host filled the disk.** About 600 MB of layer cache per build on a root disk at 90%. CI builds the image now, and the host only pulls.
- **CI deploying over SSH cut Coolify out**, with no deploy UI or logs. I reverted it: CI builds and triggers, Coolify deploys, and nothing in CI touches the host.
- **Coolify 4.3.x moved the deploy endpoint from GET to POST.** It took Claude three runs to find, because an unauthenticated probe returns 401 before the method is checked, and `curl -f` threw away the response body that said exactly what was wrong. The deploy step now prints status and body and maps 401, 403, 404 and 405 to plain explanations.
- **Coolify only interpolates `environment:`.** A `${VAR}` in `volumes:` became a *named volume*, which is how Komga's library ended up as an empty Docker volume on the root disk. A `${VAR}` in `labels:` reached Traefik as literal text, so every request got "no available server". Volume paths and domains are written out in full now.
- **Basic auth moved into the app.** With no safe place left for an htpasswd hash (labels can't interpolate it, and it can't be committed), auth became a Nitro middleware reading credentials from the environment, ahead of every route including covers and assets. Before that, a doubled `$$` in the hash had been expanded to the shell's PID, producing a hash that authenticated nobody.
- **Leave Coolify's domain field empty.** Setting one makes Coolify generate a second Traefik router for the same host, and the one Traefik picks may have no auth. The site would serve wide open and look healthy.

---

## Couch

### Same shape, different media

I had a similar problem with respect to the TV and films I watch to comics comics problem. But the similarities go only so far. I track TV on [Simkl](https://simkl.com) and films on [Letterboxd](https://letterboxd.com). Neither knows about the other, neither knows which streaming services I pay for, and neither knows about the files on my external drives. It also just seemed like a fun thing to build.

> Why track all of this? I can't speak for everyone, but I like knowing where I stopped so I can pick back up, and I like having the data. What I do with it later is up to me. (I have a jotter from like 2018/19 where I was nothing down seires i was watching and where I stopped cause we were doing manual downloads across time. I can attach a picture of it)

The first version, earlier in the year, was a CLI (it was peak CLI season). I'd exported my Letterboxd data and wanted to play with it: get recommendations from my watchlist, using local embeddings to find new films. It used Puppeteer, Inquirer and ChromaDB because I wanted cheap local embeddings but it was difficult installing and not too goot results because think about it, if we get embendings of movies watched and watchlist we woukd need embeddings of all movies in the world to get then ge able to get good recomendations. I tagged it as `v1-movies-cli` and started again on the comics skeleton.

[Couch](https://couch.otagera.xyz) is the result, and it tries to answer one question: what should I watch next? I ditched the cli and went full wen application like Comics. How it works - It reads history from Simkl and Letterboxd, fills in posters, air dates and where-to-watch from [TMDB](https://www.themoviedb.org), and asks an LLM (through [OpenRouter](https://openrouter.ai)) for picks, each explained in terms of things I've already watched. First commit to deployed took one day, because the pieces it needed were already there.

### Syncing Simkl

Simkl's free tier allows 500 API calls a day so we need to make sure we do it without burning the quota, so Couch syncs every six hours plus whenever I press Sync. It asks `/sync/activities` first and only downloads the library when the TV timestamp has moved:

```typescript
const tvActivity = activities.tv_shows?.all ?? null;

if (!force && count() > 0 && tvActivity === getSetting<string>(TV_ACTIVITY)) {
	setSetting(LAST_SYNC, new Date().toISOString());
	return { changed: false, shows: count() };
}

const data = await get<{ shows?: RawShow[] }>("/sync/all-items/shows");
```

An unchanged library costs one call.

The first deployed sync failed. I'd passed `extended=ids_only` expecting it to *add* TMDB and IMDb ids. It does the opposite: it strips everything *but* the ids. The real lesson was that sync replaces the whole table, so a response that lost its fields would quietly empty my library. It now refuses:

```typescript
if (shows.length > 0 && shows.every((s) => !s.status)) {
	throw new SimklError(
		"Simkl returned shows without status; not replacing the library.",
	);
}
```

This is the same rule as the Notion sync in comics: an external source must not be able to erase what you already know.

### Films from Letterboxd

So getting data off letterboxd is a bit tricky, because Access to the Letterboxd API is available by request only, so we make do. Films come from the Letterboxd export zip (full history, ratings, reviews, watchlist, lists) plus the public diary RSS feed for new watches. The Taste page takes the export as an upload, read by an 80-line zip reader on `node:zlib`. It reads the central directory at the end of the file, inflates stored or deflated entries, and only writes files it recognises from the export under fixed names, so a crafted path inside the archive has nowhere to go.

Something else to handle was lists. On Lettweboxd the lists don't function how I'd like ezpecially lists that I am working through in order, so Couch follows them: my own, ones I've liked, or any URL I paste. With no API, that means reading the public page. Scraping breaks, so it's done sparingly: each list at most once a week, one page at a time with a pause, and a failure marks only that list. Progress ("film 13 of 33") is computed live from my history, so the weekly read only matters when the list itself changes.

### How the picks work

This is where the old CLI's ChromaDB and embeddings went. There are three steps, and only the last is expensive.

**1. Taste profile.** One call to a cheap model reads my whole history (shows, film ratings and reviews, followed lists, feedback on past picks, my own notes) and writes a short plain-language profile. It's stored with a hash of its inputs and rebuilt only when that changes. It's shown on the Taste page on purpose: if it reads wrong, the picks will be wrong, and I can see why and correct it.

![The Taste page: the generated profile and my notes](/writing/comics-and-couch/couch-taste.webp)

**2. Candidates, no LLM.** TMDB recommendations for my best-rated titles, well-rated titles on my services, trending, my film watchlist, and anything unwatched on my drives. Watched and rejected titles are dropped, and a cheap pre-rank keeps about 60:

```typescript
const score = (c: Candidate) =>
	c.because.size * 2 +
	(c.sources.has("my-services") ? 1.5 : 0) +
	(c.watchlistOnServices ? 3 : c.sources.has("watchlist") ? 0.5 : 0) +
	(c.local ? 2 : 0) +
	(c.item.voteCount >= 100 ? c.item.voteAverage / 5 : 0);
```

`because` is the set of my favourites whose recommendations included the title. Five favourites pointing at something says more than it trending this week.

**3. The pick.** One call gets the profile and the pool and returns 8 picks with reasons. I mark each *good* or *not for me*, and that feeds the next run. A run costs well under a cent and only happens when I ask. With a good profile and a ranked pool, the model is choosing and explaining rather than discovering, so the default is a cheap model (`openai/gpt-5.6-luna`). `picks --dry-run` prints the exact prompt without calling anything, which made tuning fast.

![Picks, each with a reason and where it streams](/writing/comics-and-couch/couch-picks.webp)

### TV and films as equals on the homepage

When Claude did the first run of the UI, what it did was TV-first because Simkl came first (Claude was Clauding). That was wrong: I only wanted TV, I'd just open Simkl and it was meant to be a one stop shop of everything movies and tv shows. The home page is organised by what I'd do next, both mixed: *Up next* (shows in progress plus the next film in lists I'm working through), *Ready tonight* (new episodes plus watchlist films on my services), then list progress, coming soon, and paused shows.

![Couch home: Up next and Ready tonight, TV and films mixed](/writing/comics-and-couch/couch-home.webp)

Small fix along the way: Simkl's episode total includes episodes that haven't aired, so caught-up shows looked behind. Couch counts aired episodes only.

### Handling local drives

I also have films and TV shows on external drives that I would like to be tracked. Comics knows what's on its disk because it put it there; Couch has to find out, so it has a scanner, run on whichever machine the drives are plugged into, that can push results to the deployed app:

```bash
npm run cli -- scan /Volumes/MyDrive --dry-run
npm run cli -- scan /Volumes/MyDrive --push https://couch.otagera.xyz
```

The filename parser is a pure function, like the comics one, and handles the usual layouts:

```text
Movies/Heat (1995)/Heat (1995).mkv          -> film "Heat" 1995
Heat.1995.1080p.BluRay.x264.mkv             -> film "Heat" 1995
Succession/Season 04/S04E09.mkv             -> Succession S4E9
Succession.S04E09E10.1080p.WEB.mkv          -> S4E9-10 (double episode)
The Office/1x05.avi                         -> The Office S1E5
```

Scene-style film names are cut at the first release tag (`1080p`, `BluRay`, `x265`...) and take the year nearest the cut, which keeps *Blade Runner 2049 (2017)* intact. A bare `1917` is a title, not a year. Couch stores coverage per drive down to the episode and treats my drives as another streaming service in picks and on the home page.

### Authentication

Comics uses a basic app-level auth. I wanted to use passkey and fingerprint, so Couch uses passkeys via `@simplewebauthn/server`. A setup code from the environment registers the first one; after that, sign-in is passkey-only, synced passkeys work across devices, and new devices can be added with a one-time ten-minute code. Sessions are server-side and stored hashed. The scanner can't do WebAuthn, so pushing a scan uses a separate token.

One bundling gotcha: the library's X.509 dependency needs `reflect-metadata` loaded first, and bundling broke that order. Shipping it as a traced external instead of bundling it fixed it.

---

## The Pattern Underneath

Couch only took a day because of decisions made, and paid for, in comics:

- **The core imports only `node:` builtins.** In both apps the core (sync, parsing, database, CLI) has no npm dependencies; npm packages stay at the edges, in the UI framework and, for Couch, passkey auth. Couch uses `node:sqlite` and comics runs its CLI with Node's type stripping, so the maintenance CLI runs straight from TypeScript source with no build step and no `node_modules` in the image. No native modules also means a plain `node:24-alpine` image.
- **External services are contacted in one place, on a schedule.** Drive in comics, Simkl and TMDB in Couch. The UI reads SQLite, so browsing costs no quota.
- **The UI is a thin layer.** TanStack Start, with every server function in one `fns.ts`. Same Sunset-vault tokens, light and dark from the start.
- **Syncs never destroy what you already know.** Notion rows only move forward, and the Simkl sync refuses a response that looks empty.
- **Fuzzy matches are evidence, not decisions.** Comics asks before linking a Notion row; Couch shows its taste profile so I can see what the model thinks.
- **Same deploy, already debugged.** GHCR, Coolify webhook via POST, Traefik labels in compose, domain field empty. Couch's README just says "as in comics."
- **Logs go to [Chatterbox](https://github.com/Otagera/chatterbox)**, my own log viewer, through a client that also uses only built-ins and drops a batch rather than failing a cron run if Chatterbox is down.

The bigger lesson is that the second app is where the first one pays off. Most of comics' cost was infrastructure lessons: Coolify's interpolation rules, where the disk went, why the site served without auth. None of that had to be learned again.

---

## What's Next

- **Connect the drives.** Couch's scanner is tested against real naming patterns, but the drives aren't attached to my current machine yet.
- **Make "not for me" say why.** Right now it only excludes a title; it should feed a reason back into the taste profile.
- **Share more code.** The two apps share conventions and a theme by copy. If a third one shows up, the shared pieces (log client, auth, theme, deploy workflow) should become a package.
- **Kudi** On the theme of niche personal web applications, I am already using this one already and I think this one has sme promise for wide use. But I need to use it as a daily driver for a while and see pain points and possible common ground for pass use if it would ever be possible.

---

> **A note on how these were built.** I built both apps with [Claude Code](https://claude.com/claude-code). I decided what each app should do and where its boundaries sit, ran it against my real data, and pushed back when something was wrong, but Claude wrote most of the code. The commits carry its co-author line.
