export interface NowPlayingTrack {
  name: string;
  artist: string;
  url: string;
  album: string;
  image: string;
  isPlaying: boolean;
}

interface LastfmResponse {
  recenttracks: {
    track: Array<{
      name: string;
      artist: { '#text': string };
      url: string;
      album: { '#text': string };
      image: Array<{ '#text': string }>;
      '@attr'?: { nowplaying: string };
    }>;
  };
}

export async function getNowPlaying(user: string, apiKey: string): Promise<NowPlayingTrack | null> {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=1`;
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = (await response.json()) as LastfmResponse;
    const track = data.recenttracks.track[0];
    
    if (!track) return null;

    const image = track.image[2]?.['#text'] || track.image[0]?.['#text'] || '';

    return {
      name: track.name,
      artist: track.artist['#text'],
      url: track.url,
      album: track.album['#text'],
      image,
      isPlaying: track['@attr'] ? track['@attr'].nowplaying === 'true' : false
    };
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    return null;
  }
}
