'use client';

import { useMemo } from 'react';
import WordCloud from 'react-d3-cloud';

interface MoodWordCloudProps {
  words: {
    text: string;
    value: number;
  }[];
}

export function MoodWordCloud({ words }: MoodWordCloudProps) {
  // Transform words data for react-d3-cloud
  const cloudWords = useMemo(() => {
    if (!words || words.length === 0) {
      return [];
    }
    return words.map(word => ({
      text: word.text,
      value: word.value
    }));
  }, [words]);

  // Calculate font size based on word value
  const fontSize = (word: { value: number }) => {
    const minSize = 20;
    const maxSize = 80;
    const maxValue = Math.max(...cloudWords.map(w => w.value));
    const minValue = Math.min(...cloudWords.map(w => w.value));
    const range = maxValue - minValue || 1;
    return minSize + ((word.value - minValue) / range) * (maxSize - minSize);
  };

  // Color palette
  const colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];
  const fill = (_: any, index: number) => colors[index % colors.length];

  if (!cloudWords || cloudWords.length === 0) {
    return (
      <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
        <p className="text-gray-400">No mood keywords available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
      <WordCloud
        data={cloudWords}
        fontSize={fontSize}
        font="Inter, sans-serif"
        fontWeight="bold"
        spiral="archimedean"
        rotate={0}
        padding={2}
        fill={fill}
      />
    </div>
  );
}