// src/pages/Analytics.tsx

import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for the chart. In a real app, this data would come from a database or API.
const data = [
  { date: '2024-03-01', taken: 3, missed: 0 },
  { date: '2024-03-02', taken: 2, missed: 1 },
  { date: '2024-03-03', taken: 3, missed: 0 },
  { date: '2024-03-04', taken: 2, missed: 1 },
  { date: '2024-03-05', taken: 3, missed: 0 },
];

const Analytics = () => {
  // Calculate overall adherence percentage.
  const totalTaken = data.reduce((sum, entry) => sum + entry.taken, 0);
  const totalMissed = data.reduce((sum, entry) => sum + entry.missed, 0);
  const adherencePercentage =
    totalTaken + totalMissed > 0
      ? Math.round((totalTaken / (totalTaken + totalMissed)) * 100)
      : 0;

  return (
    <div className="min-h-screen p-6 space-y-8">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Medication Adherence Analytics</h1>

        {/* Adherence Overview Card */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Adherence Overview</h2>
            <p className="text-sm text-muted-foreground">
              Overall medication adherence: <span className="font-bold">{adherencePercentage}%</span>
            </p>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                {/* Light grid lines */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                {/* X/Y axes styled for dark mode readability */}
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--foreground))"
                />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  /* Ensures tooltip background & text are readable in dark mode */
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend
                  wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line
                  type="monotone"
                  dataKey="taken"
                  stroke="#4ade80" // green
                  name="Taken"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="missed"
                  stroke="#f87171" // red
                  name="Missed"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Personalized Recommendation Card */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-semibold">Personalized Recommendation</h2>
          <p className="text-sm text-muted-foreground">
            Based on your medication history, we recommend taking your medications a few
            minutes earlier to improve overall adherence.
          </p>
          <Button variant="outline">Learn More</Button>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
