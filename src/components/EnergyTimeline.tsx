'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EnergyTimelineProps {
  data: {
    trackName: string;
    energy: number;
    valence: number;
  }[];
}

export function EnergyTimeline({ data }: EnergyTimelineProps) {
  // Safety check: handle undefined or empty data array
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
        <p className="text-gray-400">No timeline data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="trackName" 
            angle={-45}
            textAnchor="end"
            height={100}
            stroke="#888"
            fontSize={12}
          />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="energy" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            name="Energy"
          />
          <Line 
            type="monotone" 
            dataKey="valence" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ fill: '#22c55e', r: 4 }}
            name="Happiness"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}