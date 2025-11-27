import { NextRequest, NextResponse } from 'next/server';
import { analyzePlaylist } from '@/lib/spotify-api';
import { analyzeMood } from '@/lib/mood-analyzer';

export async function POST(request: NextRequest) {
  try {
    const { playlistUrl } = await request.json();

    if (!playlistUrl) {
      return NextResponse.json(
        { error: 'Playlist URL is required' },
        { status: 400 }
      );
    }

    // Analyze the playlist
    const { playlist, tracks, audioFeatures, isDemo } = await analyzePlaylist(playlistUrl);

    // Perform mood analysis
    const moodAnalysis = analyzeMood(tracks, audioFeatures);

    return NextResponse.json({
      success: true,
      isDemo,
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          image: playlist.images[0]?.url || null,
          trackCount: tracks.length,
        },
        analysis: moodAnalysis,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to analyze playlist',
        success: false 
      },
      { status: 500 }
    );
  }
}