'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MoodChart } from './MoodChart';
import { EnergyTimeline } from './EnergyTimeline';
import { MoodWordCloud } from './MoodWordCloud';
import { Loader2, Music, Sparkles, TrendingUp, Hash, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisResult {
  playlist: {
    id: string;
    name: string;
    description: string;
    image: string | null;
    trackCount: number;
  };
  analysis: {
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
  };
}

export function PlaylistAnalyzer() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!playlistUrl.trim()) {
      setError('Please enter a playlist URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setIsDemo(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistUrl }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze playlist');
      }

      setResult(data.data);
      setIsDemo(data.isDemo || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example playlists that should work with client credentials
  const examplePlaylists = [
    { name: 'RapCaviar', url: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' },
    { name: 'Rock Classics', url: 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U' },
    { name: 'Peaceful Piano', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Playlist Mood Analyzer
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Discover the emotional DNA of your Spotify playlists. Paste a link and unveil the hidden mood patterns using AI-powered audio analysis.
          </p>

          {/* Input Section */}
          <div className="glass-card p-6 md:p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="https://open.spotify.com/playlist/..."
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-base"
                disabled={loading}
              />
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Music className="mr-2 h-5 w-5" />
                    Analyze Playlist
                  </>
                )}
              </Button>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Examples */}
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-3">Try these demo playlists to see the analyzer in action:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examplePlaylists.map((playlist) => (
                <button
                  key={playlist.name}
                  onClick={() => setPlaylistUrl(playlist.url)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-purple-300 hover:text-purple-200 transition-all"
                >
                  {playlist.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Note: Due to Spotify API limitations, demo data is used for visualization
            </p>
          </div>
        </motion.div>

        {/* Results Section */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Demo Mode Notice */}
            {isDemo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-blue-300 text-sm">
                      <strong>Demo Mode:</strong> Due to Spotify API access limitations with Client Credentials, this analysis uses realistic simulated data based on typical playlist characteristics. The mood analysis algorithm and visualizations are fully functional!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Playlist Info */}
            <Card className="glass-card p-6 md:p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {result.playlist.image && (
                  <img
                    src={result.playlist.image}
                    alt={result.playlist.name}
                    className="w-32 h-32 rounded-lg shadow-lg"
                  />
                )}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">{result.playlist.name}</h2>
                  <p className="text-gray-300 mb-2">{result.playlist.description}</p>
                  <p className="text-sm text-gray-400">{result.playlist.trackCount} tracks</p>
                </div>
              </div>
            </Card>

            {/* Overall Mood */}
            <Card className="glass-card p-6 md:p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold">Overall Mood</h3>
              </div>
              <div className="text-center py-6">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                  {result.analysis.overallMood}
                </div>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  {result.analysis.moodDescription}
                </p>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Energy', value: result.analysis.stats.avgEnergy, icon: '⚡', color: 'from-red-500 to-orange-500' },
                { label: 'Happiness', value: result.analysis.stats.avgValence, icon: '😊', color: 'from-green-500 to-emerald-500' },
                { label: 'Danceability', value: result.analysis.stats.avgDanceability, icon: '💃', color: 'from-blue-500 to-cyan-500' },
                { label: 'Tempo', value: result.analysis.stats.avgTempo, icon: '🎵', color: 'from-purple-500 to-pink-500', suffix: ' BPM' },
              ].map((stat, idx) => (
                <Card key={idx} className="glass-card p-4 backdrop-blur-xl bg-white/10 border border-white/20 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                    {stat.value}{stat.suffix || '%'}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Mood Breakdown */}
            <Card className="glass-card p-6 md:p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Hash className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold">Emotional Breakdown</h3>
              </div>
              <MoodChart data={result.analysis.emotionalBreakdown} />
            </Card>

            {/* Energy Timeline */}
            <Card className="glass-card p-6 md:p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-bold">Energy & Happiness Timeline</h3>
              </div>
              <EnergyTimeline data={result.analysis.energyTimeline} />
            </Card>

            {/* Word Cloud */}
            <Card className="glass-card p-6 md:p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold">Mood Keywords</h3>
              </div>
              <MoodWordCloud words={result.analysis.topWords} />
            </Card>

            {/* Insights */}
            <Card className="glass-card p-6 md:p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Music className="w-6 h-6 text-pink-400" />
                <h3 className="text-2xl font-bold">AI Insights</h3>
              </div>
              <div className="space-y-3">
                {result.analysis.insights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="text-2xl">{idx + 1}</div>
                    <p className="text-gray-200 flex-1">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}