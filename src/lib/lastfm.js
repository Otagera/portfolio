export async function getNowPlaying(user, apiKey) {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=1`;
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    const track = data.recenttracks.track[0];
    
    if (!track) return null;

    return {
      name: track.name,
      artist: track.artist['#text'],
      url: track.url,
      album: track.album['#text'],
      image: track.image[2]['#text'], // Medium size
      isPlaying: track['@attr'] ? track['@attr'].nowplaying === 'true' : false
    };
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    return null;
  }
}
