'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface MoodWordCloudProps {
  words: {
    text: string;
    value: number;
  }[];
}

export function MoodWordCloud({ words }: MoodWordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform words data
  const cloudWords = useMemo(() => {
    if (!words || words.length === 0) {
      return [];
    }
    return words.map(word => ({
      text: word.text,
      value: word.value
    }));
  }, [words]);

  useEffect(() => {
    if (!cloudWords || cloudWords.length === 0 || !svgRef.current || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous rendering
    d3.select(svgRef.current).selectAll('*').remove();

    // Calculate font size based on word value
    const maxValue = Math.max(...cloudWords.map(w => w.value));
    const minValue = Math.min(...cloudWords.map(w => w.value));
    const range = maxValue - minValue || 1;
    
    const fontSize = (word: { value: number }) => {
      const minSize = 20;
      const maxSize = 80;
      return minSize + ((word.value - minValue) / range) * (maxSize - minSize);
    };

    // Color palette
    const colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];

    // Create word cloud layout
    const layout = cloud()
      .size([width, height])
      .words(cloudWords.map(d => ({ ...d, size: fontSize(d) })))
      .padding(2)
      .rotate(() => 0)
      .spiral('archimedean')
      .font('Inter, sans-serif')
      .fontWeight('bold')
      .fontSize((d: any) => d.size)
      .on('end', (words: any[]) => {
        // Render the word cloud
        const svg = d3.select(svgRef.current);
        
        const g = svg
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        g.selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', (d: any) => `${d.size}px`)
          .style('font-family', 'Inter, sans-serif')
          .style('font-weight', 'bold')
          .style('fill', (_: any, i: number) => colors[i % colors.length])
          .attr('text-anchor', 'middle')
          .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
          .text((d: any) => d.text);
      });

    layout.start();
  }, [cloudWords]);

  if (!cloudWords || cloudWords.length === 0) {
    return (
      <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
        <p className="text-gray-400">No mood keywords available</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-[300px] md:h-[400px] flex items-center justify-center"
    >
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}