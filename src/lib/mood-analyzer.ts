import { SpotifyAudioFeatures, SpotifyTrack, MoodAnalysis } from './spotify-types';

interface MoodCategory {
  name: string;
  color: string;
  weight: number;
}

function categorizeMood(valence: number, energy: number): MoodCategory {
  // Valence = happiness (0-1), Energy = intensity (0-1)
  
  if (valence >= 0.6 && energy >= 0.6) {
    return { name: 'Energetic & Happy', color: '#22c55e', weight: 1 };
  } else if (valence >= 0.6 && energy < 0.6) {
    return { name: 'Calm & Peaceful', color: '#3b82f6', weight: 1 };
  } else if (valence < 0.4 && energy >= 0.6) {
    return { name: 'Intense & Aggressive', color: '#ef4444', weight: 1 };
  } else if (valence < 0.4 && energy < 0.4) {
    return { name: 'Sad & Melancholic', color: '#8b5cf6', weight: 1 };
  } else if (valence >= 0.4 && valence < 0.6 && energy >= 0.5) {
    return { name: 'Neutral & Upbeat', color: '#f59e0b', weight: 1 };
  } else {
    return { name: 'Chill & Relaxed', color: '#06b6d4', weight: 1 };
  }
}

function generateInsights(
  features: SpotifyAudioFeatures[],
  stats: { avgEnergy: number; avgValence: number; avgDanceability: number; avgTempo: number }
): string[] {
  const insights: string[] = [];

  // Energy insights
  if (stats.avgEnergy > 0.7) {
    insights.push('⚡ This playlist is packed with high-energy tracks that will get you moving!');
  } else if (stats.avgEnergy < 0.3) {
    insights.push('😌 Perfect for winding down—this playlist has a very relaxed vibe.');
  }

  // Valence insights
  if (stats.avgValence > 0.7) {
    insights.push('😊 Overall positive and uplifting mood—great for boosting your spirits!');
  } else if (stats.avgValence < 0.3) {
    insights.push('😢 This playlist leans towards melancholic and introspective tones.');
  }

  // Danceability insights
  if (stats.avgDanceability > 0.7) {
    insights.push('💃 Highly danceable! Perfect for parties or workout sessions.');
  } else if (stats.avgDanceability < 0.3) {
    insights.push('🎧 More suited for focused listening than dancing.');
  }

  // Tempo insights
  if (stats.avgTempo > 140) {
    insights.push('🏃 Fast-paced tracks dominate—ideal for running or cardio workouts!');
  } else if (stats.avgTempo < 90) {
    insights.push('🧘 Slow tempo throughout—perfect for meditation or study sessions.');
  }

  // Consistency insights
  const energyVariance = features.reduce((sum, f) => sum + Math.pow(f.energy - stats.avgEnergy, 2), 0) / features.length;
  if (energyVariance < 0.02) {
    insights.push('📊 Very consistent energy levels—smooth listening experience from start to finish.');
  } else if (energyVariance > 0.08) {
    insights.push('🎢 Wide variety in energy levels—this playlist takes you on an emotional journey!');
  }

  return insights.slice(0, 5); // Return top 5 insights
}

function generateWordCloud(
  features: SpotifyAudioFeatures[],
  stats: { avgEnergy: number; avgValence: number; avgDanceability: number; avgAcousticness: number }
): { text: string; value: number }[] {
  const words: { text: string; value: number }[] = [];

  // Add mood-related words based on features
  if (stats.avgValence > 0.6) {
    words.push({ text: 'Happy', value: Math.round(stats.avgValence * 100) });
    words.push({ text: 'Uplifting', value: Math.round(stats.avgValence * 80) });
    words.push({ text: 'Joyful', value: Math.round(stats.avgValence * 70) });
  } else if (stats.avgValence < 0.4) {
    words.push({ text: 'Melancholic', value: Math.round((1 - stats.avgValence) * 100) });
    words.push({ text: 'Somber', value: Math.round((1 - stats.avgValence) * 80) });
    words.push({ text: 'Moody', value: Math.round((1 - stats.avgValence) * 70) });
  }

  if (stats.avgEnergy > 0.6) {
    words.push({ text: 'Energetic', value: Math.round(stats.avgEnergy * 100) });
    words.push({ text: 'Dynamic', value: Math.round(stats.avgEnergy * 85) });
    words.push({ text: 'Powerful', value: Math.round(stats.avgEnergy * 75) });
  } else if (stats.avgEnergy < 0.4) {
    words.push({ text: 'Calm', value: Math.round((1 - stats.avgEnergy) * 100) });
    words.push({ text: 'Peaceful', value: Math.round((1 - stats.avgEnergy) * 85) });
    words.push({ text: 'Gentle', value: Math.round((1 - stats.avgEnergy) * 75) });
  }

  if (stats.avgDanceability > 0.6) {
    words.push({ text: 'Danceable', value: Math.round(stats.avgDanceability * 95) });
    words.push({ text: 'Groovy', value: Math.round(stats.avgDanceability * 80) });
  }

  if (stats.avgAcousticness > 0.6) {
    words.push({ text: 'Acoustic', value: Math.round(stats.avgAcousticness * 90) });
    words.push({ text: 'Organic', value: Math.round(stats.avgAcousticness * 75) });
  }

  // Add some general descriptors
  words.push({ text: 'Emotional', value: 65 });
  words.push({ text: 'Vibrant', value: 60 });
  words.push({ text: 'Atmospheric', value: 55 });
  words.push({ text: 'Rhythmic', value: 50 });

  return words;
}

export function analyzeMood(
  tracks: SpotifyTrack[],
  audioFeatures: SpotifyAudioFeatures[]
): MoodAnalysis {
  // Calculate statistics
  const stats = {
    avgEnergy: audioFeatures.reduce((sum, f) => sum + f.energy, 0) / audioFeatures.length,
    avgValence: audioFeatures.reduce((sum, f) => sum + f.valence, 0) / audioFeatures.length,
    avgDanceability: audioFeatures.reduce((sum, f) => sum + f.danceability, 0) / audioFeatures.length,
    avgTempo: audioFeatures.reduce((sum, f) => sum + f.tempo, 0) / audioFeatures.length,
    avgAcousticness: audioFeatures.reduce((sum, f) => sum + f.acousticness, 0) / audioFeatures.length,
  };

  // Categorize each track's mood
  const moodCounts = new Map<string, { count: number; color: string }>();
  
  audioFeatures.forEach(feature => {
    const mood = categorizeMood(feature.valence, feature.energy);
    const current = moodCounts.get(mood.name) || { count: 0, color: mood.color };
    moodCounts.set(mood.name, { count: current.count + 1, color: mood.color });
  });

  // Create emotional breakdown
  const emotionalBreakdown = Array.from(moodCounts.entries())
    .map(([mood, data]) => ({
      mood,
      percentage: Math.round((data.count / audioFeatures.length) * 100),
      color: data.color,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Determine overall mood
  const overallMood = emotionalBreakdown[0]?.mood || 'Neutral';

  // Generate mood description
  const moodDescription = generateMoodDescription(stats, overallMood);

  // Create energy timeline
  const energyTimeline = tracks.slice(0, Math.min(20, tracks.length)).map((track, idx) => {
    const feature = audioFeatures[idx];
    return {
      trackName: track.name.length > 25 ? track.name.slice(0, 25) + '...' : track.name,
      energy: Math.round(feature.energy * 100),
      valence: Math.round(feature.valence * 100),
    };
  });

  // Generate insights
  const insights = generateInsights(audioFeatures, stats);

  // Generate word cloud
  const topWords = generateWordCloud(audioFeatures, stats);

  return {
    overallMood,
    moodDescription,
    emotionalBreakdown,
    energyTimeline,
    insights,
    topWords,
    stats: {
      avgEnergy: Math.round(stats.avgEnergy * 100),
      avgValence: Math.round(stats.avgValence * 100),
      avgDanceability: Math.round(stats.avgDanceability * 100),
      avgTempo: Math.round(stats.avgTempo),
    },
  };
}

function generateMoodDescription(
  stats: { avgEnergy: number; avgValence: number; avgDanceability: number; avgTempo: number },
  overallMood: string
): string {
  const descriptions: string[] = [];

  descriptions.push(`This playlist embodies a ${overallMood.toLowerCase()} atmosphere.`);

  if (stats.avgEnergy > 0.7 && stats.avgValence > 0.6) {
    descriptions.push('It\'s bursting with positive energy and infectious enthusiasm, perfect for lifting your spirits and getting you motivated.');
  } else if (stats.avgEnergy < 0.3 && stats.avgValence < 0.4) {
    descriptions.push('It carries a contemplative and introspective quality, ideal for deep reflection or embracing melancholic moments.');
  } else if (stats.avgEnergy > 0.6 && stats.avgValence < 0.4) {
    descriptions.push('It channels intense emotions with powerful, aggressive undertones—perfect for channeling strong feelings or intense workouts.');
  } else if (stats.avgEnergy < 0.4 && stats.avgValence > 0.6) {
    descriptions.push('It offers a serene and peaceful ambiance, creating the perfect backdrop for relaxation and tranquility.');
  } else {
    descriptions.push('It strikes a balanced blend of moods, offering versatility for various listening occasions.');
  }

  if (stats.avgDanceability > 0.7) {
    descriptions.push('The tracks are highly rhythmic and groove-oriented, making it impossible not to move.');
  }

  return descriptions.join(' ');
}
