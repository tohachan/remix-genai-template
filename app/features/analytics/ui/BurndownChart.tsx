import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { BurndownDataPoint } from '~/shared/lib/utils/analytics';

interface BurndownChartProps {
  data: BurndownDataPoint[];
  height?: number;
  className?: string;
}

export default function BurndownChart({
  data,
  height = 300,
  className = '',
}: BurndownChartProps) {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Ideal Burndown"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="remaining"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Actual Remaining"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            strokeWidth={2}
            name="Completed Tasks"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
