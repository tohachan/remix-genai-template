import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { BurndownDataPoint } from '~/shared/lib/utils/analytics';
import { theme } from '~/shared/design-system/theme';

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
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.gray[200]} />
          <XAxis
            dataKey="date"
            stroke={theme.colors.gray[500]}
            fontSize={12}
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

          {/* Ideal line */}
          <Line
            type="monotone"
            dataKey="ideal"
            stroke={theme.colors.gray[400]}
            strokeDasharray="5 5"
            name="Ideal Burndown"
            strokeWidth={2}
            dot={false}
          />

          {/* Actual line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke={theme.colors.primary[500]}
            strokeWidth={3}
            dot={{ fill: theme.colors.primary[500], strokeWidth: 2, r: 4 }}
            name="Actual Burndown"
          />

          {/* Completed line */}
          <Line
            type="monotone"
            dataKey="completed"
            stroke={theme.colors.success[500]}
            strokeWidth={2}
            dot={{ fill: theme.colors.success[500], strokeWidth: 2, r: 4 }}
            name="Completed Tasks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
