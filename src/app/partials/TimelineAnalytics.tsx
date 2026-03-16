"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CallAnalytics } from "@/types/CallRecord.type";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TimelineAnalyticsProps {
  analytics: CallAnalytics;
}

export default function TimelineAnalytics({
  analytics,
}: TimelineAnalyticsProps) {
  const data = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    calls: analytics.callsByHour[i] || 0,
  }));

  return (
    <Card className="col-span-full border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Call Activity Timeline (Calls per Hour)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
              />
              <XAxis
                dataKey="hour"
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
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
