export interface NowPlayingTrack {
  name: string;
  artist: string;
  url: string;
  album: string;
  image: string;
  isPlaying: boolean;
  type: 'song' | 'podcast';
}

interface LastfmResponse {
  recenttracks: {
    track: Array<{
      name: string;
      artist: { '#text': string; mbid?: string };
      url: string;
      album: { '#text': string; mbid?: string };
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
    
    // Heuristic: Check for podcast indicators
    const artistName = track.artist['#text'].toLowerCase();
    const albumName = track.album['#text'].toLowerCase();
    const trackName = track.name.toLowerCase();
    
    const REGULAR_PODCASTS = [
      "Front End Happy Hour", "Decoder with Nilay Patel", "The Spanish Football Podcast",
      "Interesting Times with Ross Douthat", "The Double Pivot", "Understood: Deepfake Porn Empire",
      "99% Invisible", "The Price of Music", "FinTalk with Adebola", "I Like Girls",
      "Full Time Europe", "Building From Scratch", "The Athletic FC Presents...",
      "On The Whistle Podcast", "The Athletic FC Tactics Podcast", "With The Perrys",
      "Post Games", "The Feeling Station", "Statecraft", "African Five-a-side",
      "Land of the Giants", "Devils in the Details", "Channels with Peter Kafka",
      "Modern Love", "HTTP 203", "This Excellent Church - TEC", "Renewing Your Mind",
      "The Surprising Rebirth Of Belief In God", "Nigeria Politics Weekly", "Empire: World History",
      "Not The Top 20 Podcast", "The Vergecast", "Wiser Than Me", "SysDsgn Conversations",
      "Tifo Football Podcast", "The Open Africa Podcast", "The Social Radars",
      "Developer Voices", "Frontier Matters", "Insights By The Covenant Nation",
      "Backend Banter", "Business History", "The Ezra Klein Show", "The Price of Football",
      "Timothy Keller Sermons Podcast", "Loose Talk", "Works in Progress Podcast",
      "The Athletic FC Podcast", "All The Right Movies", "The Totally Football Show",
      "Indie Hackers", "Everybody's Business", "Football Weekly", "Talking Sopranos",
      "Messages by Desiring God", "Real Dictators", "Against the Rules", "Meta Tech Podcast",
      "The Rest Is History", "Odd Lots", "Normal Women", "Version History",
      "The Guardian's Women's Football Weekly", "Radiolab", "This American Life",
      "The Fergie Fledglings", "Sam and Ij", "Talk of the Devils"
    ].map(p => p.toLowerCase());

    const isPodcastByList = REGULAR_PODCASTS.some(p => 
      artistName.includes(p) || albumName.includes(p) || trackName.includes(p)
    );
    
    const isPodcastByKeywords = artistName.includes('podcast') || 
                                albumName.includes('podcast') || 
                                trackName.includes('episode') ||
                                trackName.includes('ep.') ||
                                trackName.includes('podcast');
                             
    // If it's in our list OR has no MusicBrainz ID and matches keywords, it's likely a podcast
    const type = (isPodcastByList || (isPodcastByKeywords && !track.artist.mbid)) ? 'podcast' : 'song';

    return {
      name: track.name,
      artist: track.artist['#text'],
      url: track.url,
      album: track.album['#text'],
      image,
      isPlaying: track['@attr'] ? track['@attr'].nowplaying === 'true' : false,
      type
    };
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    return null;
  }
}
