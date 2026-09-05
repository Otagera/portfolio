import type { APIRoute } from 'astro';
import { getLatestScrobble } from '../../lib/maloja';

export const GET: APIRoute = async () => {
  const track = await getLatestScrobble();

  const body = track
    ? { artist: track.artist, title: track.title, playedAt: track.playedAt }
    : { artist: null, title: null, playedAt: null };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Browser/CDN cache is a secondary layer — getLatestScrobble already
      // dedupes upstream Maloja requests behind its own 45s in-memory cache.
      'Cache-Control': 'public, max-age=30, s-maxage=30',
    },
  });
};
