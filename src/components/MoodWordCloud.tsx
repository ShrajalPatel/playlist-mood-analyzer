'use client';

import { useEffect, useRef } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

interface MoodWordCloudProps {
  words: {
    text: string;
    value: number;
  }[];
}

export function MoodWordCloud({ words }: MoodWordCloudProps) {
  // Safety check: handle undefined or empty words array
  if (!words || words.length === 0) {
    return (
      <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
        <p className="text-gray-400">No mood keywords available</p>
      </div>
    );
  }

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0] as [number, number],
    fontSizes: [20, 80] as [number, number],
    colors: ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'],
    enableTooltip: true,
    deterministic: true,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    padding: 2,
    scale: 'sqrt' as const,
    spiral: 'archimedean' as const,
  };

  return (
    <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
      <ReactWordcloud words={words} options={options} />
    </div>
  );
}