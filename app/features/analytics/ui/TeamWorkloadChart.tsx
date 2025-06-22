import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WorkloadDataPoint } from '~/shared/lib/utils/analytics';
import { theme } from '~/shared/design-system/theme';

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
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.gray[200]} />
          <XAxis
            dataKey="name"
            stroke={theme.colors.gray[500]}
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke={theme.colors.gray[500]}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.colors.white,
              border: `1px solid ${theme.colors.gray[200]}`,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.md,
            }}
          />
          <Legend />
          <Bar
            dataKey="assigned"
            fill={theme.colors.primary[500]}
            name="Total Assigned"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="completed"
            fill={theme.colors.success[500]}
            name="Completed"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="inProgress"
            fill={theme.colors.warning[500]}
            name="In Progress"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
