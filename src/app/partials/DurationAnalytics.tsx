"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CallAnalytics } from "@/types/CallRecord.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { CHART_COLORS } from "@/constants/statsData";

interface DurationAnalyticsProps {
  analytics: CallAnalytics;
}

// Custom shape to replace deprecated Cell component
const CustomBar = (props: any) => {
  const { index } = props;
  return (
    <Rectangle {...props} fill={CHART_COLORS[index % CHART_COLORS.length]} />
  );
};

export default function DurationAnalytics({
  analytics,
}: DurationAnalyticsProps) {
  const data = [
    {
      name: "Shortest",
      duration: analytics.shortestCall?.callDuration || 0,
    },
    {
      name: "Average",
      duration: analytics.avgDuration,
    },
    {
      name: "Longest",
      duration: analytics.longestCall?.callDuration || 0,
    },
  ];

  return (
    <Card className="col-span-1 border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Call Duration Insights (s)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor" }}
                className="text-slate-500 dark:text-slate-400 text-xs"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor" }}
                className="text-slate-500 dark:text-slate-400 text-xs"
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                itemStyle={{
                  color: "var(--foreground)",
                }}
              />
              <Bar
                dataKey="duration"
                radius={[6, 6, 0, 0]}
                barSize={60}
                shape={<CustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
