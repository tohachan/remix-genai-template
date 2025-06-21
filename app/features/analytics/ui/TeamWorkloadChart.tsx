import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WorkloadDataPoint } from '~/shared/lib/utils/analytics';

interface TeamWorkloadChartProps {
  data: WorkloadDataPoint[];
  height?: number;
  className?: string;
}

export default function TeamWorkloadChart({
  data,
  height = 300,
  className = '',
}: TeamWorkloadChartProps) {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
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
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
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
          <Bar
            dataKey="assigned"
            fill="#3b82f6"
            name="Total Assigned"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="completed"
            fill="#10b981"
            name="Completed"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="inProgress"
            fill="#f59e0b"
            name="In Progress"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
