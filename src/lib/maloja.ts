export interface MalojaTrack {
  artist: string;
  title: string;
  playedAt: number; // unix seconds
}

interface MalojaScrobblesResponse {
  status: string;
  list: Array<{
    time: number;
    track: {
      artists: string[];
      title: string;
      album: string | null;
      length: number | null;
    };
    duration: number | null;
    origin: string;
  }>;
}

const MALOJA_BASE_URL = process.env.MALOJA_BASE_URL || 'https://maloja.otagera.xyz';
const CACHE_TTL_MS = 45_000;

let cache: { data: MalojaTrack | null; expiresAt: number } | null = null;

async function fetchLatestScrobble(): Promise<MalojaTrack | null> {
  // Bypassing SSL check for corporate/intercepting proxies (SELF_SIGNED_CERT_IN_CHAIN)
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const response = await fetch(`${MALOJA_BASE_URL}/apis/mlj_1/scrobbles?perpage=1`, {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Maloja responded with ${response.status}`);
  }

  const data = (await response.json()) as MalojaScrobblesResponse;
  const entry = data.list?.[0];
  if (!entry) return null;

  return {
    artist: entry.track.artists.join(', ') || 'Unknown artist',
    title: entry.track.title,
    playedAt: entry.time,
  };
}

// Server-side only: reads/writes an in-memory cache, so this must never run in the browser.
export async function getLatestScrobble(): Promise<MalojaTrack | null> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.data;
  }

  try {
    const data = await fetchLatestScrobble();
    cache = { data, expiresAt: now + CACHE_TTL_MS };
    return data;
  } catch (error) {
    console.error('Error fetching Maloja scrobble:', error);
    // Prefer stale data over nothing if Maloja is temporarily unreachable.
    if (cache) return cache.data;
    cache = { data: null, expiresAt: now + CACHE_TTL_MS };
    return null;
  }
}
