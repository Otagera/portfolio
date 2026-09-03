So previously I took inspiration of [this]() and with AI (Gemini mostly) was able to come up with some working KV DB then Document style then eventually a passable SQL db all built on top of each other. On some level it the most impressive this I have done (with the caveat that AI was involved, feel how you feel about it cause I sure have not too good feelings about it) so after going around thinking of what to work on next after working on a couple of "games", I knew that DBs were way more than what I had done, for one I was not able to use it in even a dummy application. So I went back to claude and asked it to suggest some new directions to go with it and it suggested distribution (which would involve replication, partitioning, sharding, etc.) good stuff, but then i thought why not do this whole thing in Rust, (I am not a masochist but yeah this was a weird decision when my understanding of rust was/is still sparse). So rust it was, start the whole thing from the beginning and do what we did before.

So this blog is about that re-write mostly. Before work began I asked Claude to review the Typescript code and draft a curricullm factoring the way the TS version was built up from using a simple file to store the KVs (the git history was helpful here) and we did, the past couple of weeks has been about that start.

As highlighted in that post by Niyi he highlighted that every DB is built on a KV store which can be a simple text file which we explored before building upon. What that then indicates is that even in memory as we process new information we need a way to keep the key value pairs. Then walks in what is called Memtable (as in Memory table get it _wink_)
So then we started with Memtable (in memory sorted map). Think of it as a map as simple as that, it to show that we use BTreeMap for our data in our memtable struct

```rust
pub struct MemTable {
    data: BTreeMap<Vec<u8>, Option<Vec<u8>>>,
    size: usize,
}
```

<Sidenote: In Rust there are 2 Hashmap data structures we could use but we went with BTreeMap because it is sorted automatically by keys.>

As with every map we need to be able to add new pairs, access the value of a pair, delete a pair with the key, get the map size and clear the whole thing if need be.

Which brings us to answering some questions from out MemTable struct there.

1. Why are we using `Vec<u8>`? Call me crazy but I thought since we are using rust why don't we use binary files instead of plain files as our persistent storage? (on some level everything might be a binary file and you can do this in Typescript on some level). First i thought since it is Rust it would sort of be native to deal with that than in Typescript where JSON is wildly used and parsing is just straight forward. Secondly, I could use an experience with dealing with binaries (spoiler alert I have indeed learnt come things already about encoding and decoding into binary).
2. Why `Option<Vec<u8>>>`? Well we've answered the `Vec<u8>` part of it all, the `Option<T>` part is a way for us to handle Tombstone <explain it with sidenote. A Tombstone is a way to signal that something is not there, when something was there before. When we get to explaining the engine we use LSM(although I want to have b-tree as another option when we get to SQL) I will try to explain better. But in LSM writing new data is append only because doing a look up then changing the data there is a lot, so you simply write new line to indicate that is had been updated with the deletion marker i.e the tombstone and later on when doing compaction it recognises that that key-value pair has been deleted> in memory. Rust provides this handy thing Option that is a built-in enum in the Rust Standard Library to represent either the presence of a value (Some) or the total absence of a value (None). So we can check like this

```rust
match value {
  Some(inner_value) => {
    // do something with inner)value
  }
  None => {
    // Do something else
  }
}
```

1. Size - This is pretty straightforward, we just want a handy way to keep track of the size as we make changes to the data store and would be easy to get at any point.

Naive on-disk persistence
As stated earlier we persistent data to disk, in more sophisticated systems how that is store is more advanced and we will get to those very soon as much as we can but for a start we need a way
