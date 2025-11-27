export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
}

export interface SpotifyAudioFeatures {
  id: string;
  valence: number; // 0-1 (happiness)
  energy: number; // 0-1
  danceability: number; // 0-1
  acousticness: number; // 0-1
  instrumentalness: number; // 0-1
  speechiness: number; // 0-1
  tempo: number; // BPM
  loudness: number; // dB
}

export interface PlaylistData {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    items: Array<{
      track: SpotifyTrack;
    }>;
  };
}

export interface MoodAnalysis {
  overallMood: string;
  moodDescription: string;
  emotionalBreakdown: {
    mood: string;
    percentage: number;
    color: string;
  }[];
  energyTimeline: {
    trackName: string;
    energy: number;
    valence: number;
  }[];
  insights: string[];
  topWords: {
    text: string;
    value: number;
  }[];
  stats: {
    avgEnergy: number;
    avgValence: number;
    avgDanceability: number;
    avgTempo: number;
  };
}
