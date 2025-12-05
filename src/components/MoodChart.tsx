'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MoodChartProps {
  data: {
    mood: string;
    percentage: number;
    color: string;
  }[];
}

export function MoodChart({ data }: MoodChartProps) {
  // Safety check: handle undefined or empty data array
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
        <p className="text-gray-400">No mood data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ mood, percentage }) => `${mood}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="percentage"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}