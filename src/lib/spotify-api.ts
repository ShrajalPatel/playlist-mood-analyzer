import { SpotifyTrack, SpotifyAudioFeatures, PlaylistData } from './spotify-types';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

let cachedToken: { token: string; expires: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expires > Date.now()) {
    return cachedToken.token;
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || '';

  if (!clientId || !clientSecret) {
    throw new Error('Spotify API credentials not configured');
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Spotify token error:', response.status, errorData);
    throw new Error(`Failed to get Spotify access token: ${response.status} ${errorData}`);
  }

  const data = await response.json();
  
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

export function extractPlaylistId(url: string): string | null {
  const patterns = [
    /playlist\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  if (/^[a-zA-Z0-9]{22}$/.test(url)) {
    return url;
  }

  return null;
}

// Generate realistic demo data when API access fails
function generateDemoData(playlistId: string): { playlist: PlaylistData; tracks: SpotifyTrack[]; audioFeatures: SpotifyAudioFeatures[] } {
  const demoPlaylists: Record<string, { name: string; description: string; mood: 'happy' | 'chill' | 'energetic' | 'sad' }> = {
    '37i9dQZF1DX0XUsuxWHRQd': { name: 'RapCaviar', description: 'New music from Lil Baby, Travis Scott, and Kodak Black.', mood: 'energetic' },
    '37i9dQZF1DWXRqgorJj26U': { name: 'Rock Classics', description: 'Rock legends & epic songs that continue to inspire generations.', mood: 'energetic' },
    '37i9dQZF1DX4sWSpwq3LiO': { name: 'Peaceful Piano', description: 'Relax and indulge with beautiful piano pieces.', mood: 'chill' },
    '37i9dQZF1DXcBWIGoYBM5M': { name: "Today's Top Hits", description: 'Ed Sheeran is on top of the Hottest 50!', mood: 'happy' },
  };

  const playlistInfo = demoPlaylists[playlistId] || { 
    name: 'Demo Playlist', 
    description: 'A sample playlist for demonstration purposes.', 
    mood: 'happy' as const 
  };

  const tracks: SpotifyTrack[] = [];
  const audioFeatures: SpotifyAudioFeatures[] = [];

  const trackCount = 30;

  for (let i = 0; i < trackCount; i++) {
    const trackId = `demo_track_${playlistId}_${i}`;
    
    tracks.push({
      id: trackId,
      name: `Track ${i + 1}`,
      artists: [{ name: `Artist ${i + 1}` }],
      album: {
        name: `Album ${i + 1}`,
        images: [{ url: 'https://via.placeholder.com/300' }],
      },
      duration_ms: 180000 + Math.random() * 120000,
    });

    // Generate features based on playlist mood
    let baseEnergy = 0.5;
    let baseValence = 0.5;
    let baseDanceability = 0.5;
    let baseTempo = 120;

    switch (playlistInfo.mood) {
      case 'happy':
        baseEnergy = 0.7;
        baseValence = 0.8;
        baseDanceability = 0.7;
        baseTempo = 125;
        break;
      case 'energetic':
        baseEnergy = 0.8;
        baseValence = 0.6;
        baseDanceability = 0.8;
        baseTempo = 140;
        break;
      case 'chill':
        baseEnergy = 0.3;
        baseValence = 0.6;
        baseDanceability = 0.4;
        baseTempo = 90;
        break;
      case 'sad':
        baseEnergy = 0.3;
        baseValence = 0.3;
        baseDanceability = 0.3;
        baseTempo = 80;
        break;
    }

    audioFeatures.push({
      id: trackId,
      valence: Math.max(0, Math.min(1, baseValence + (Math.random() - 0.5) * 0.4)),
      energy: Math.max(0, Math.min(1, baseEnergy + (Math.random() - 0.5) * 0.4)),
      danceability: Math.max(0, Math.min(1, baseDanceability + (Math.random() - 0.5) * 0.4)),
      acousticness: Math.random() * 0.8,
      instrumentalness: Math.random() * 0.5,
      speechiness: Math.random() * 0.3,
      tempo: baseTempo + (Math.random() - 0.5) * 40,
      loudness: -10 + Math.random() * 8,
    });
  }

  const playlist: PlaylistData = {
    id: playlistId,
    name: playlistInfo.name,
    description: playlistInfo.description,
    images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }],
    tracks: {
      items: tracks.map(track => ({ track })),
    },
  };

  return { playlist, tracks, audioFeatures };
}

export async function fetchPlaylistData(playlistId: string): Promise<PlaylistData> {
  const token = await getAccessToken();
  
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Spotify playlist fetch error:', response.status, errorData);
    
    // Return null to trigger demo mode instead of throwing
    throw new Error('API_ACCESS_LIMITED');
  }

  return response.json();
}

export async function fetchAudioFeatures(trackIds: string[]): Promise<SpotifyAudioFeatures[]> {
  const token = await getAccessToken();
  
  const chunks = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100));
  }

  const allFeatures: SpotifyAudioFeatures[] = [];

  for (const chunk of chunks) {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${chunk.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Spotify audio features error:', response.status, errorData);
      throw new Error('API_ACCESS_LIMITED');
    }

    const data = await response.json();
    allFeatures.push(...data.audio_features.filter(Boolean));
  }

  return allFeatures;
}

export async function analyzePlaylist(playlistUrl: string) {
  const playlistId = extractPlaylistId(playlistUrl);
  
  if (!playlistId) {
    throw new Error('Invalid Spotify playlist URL');
  }

  try {
    // Try to fetch real data first
    const playlistData = await fetchPlaylistData(playlistId);
    
    const trackIds = playlistData.tracks.items
      .map(item => item.track?.id)
      .filter(Boolean) as string[];

    if (trackIds.length === 0) {
      throw new Error('No tracks found in playlist');
    }

    const audioFeatures = await fetchAudioFeatures(trackIds);

    return {
      playlist: playlistData,
      tracks: playlistData.tracks.items.map(item => item.track),
      audioFeatures,
      isDemo: false,
    };
  } catch (error) {
    // If API access fails, use demo mode
    if (error instanceof Error && error.message === 'API_ACCESS_LIMITED') {
      console.log('Using demo mode due to API limitations');
      const demoData = generateDemoData(playlistId);
      return {
        ...demoData,
        isDemo: true,
      };
    }
    throw error;
  }
}