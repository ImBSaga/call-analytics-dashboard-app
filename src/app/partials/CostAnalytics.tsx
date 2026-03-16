"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CallAnalytics } from "@/types/CallRecord.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CostAnalyticsProps {
  analytics: CallAnalytics;
}

export default function CostAnalytics({ analytics }: CostAnalyticsProps) {
  const data = Object.entries(analytics.costsByCity)
    .map(([city, cost]) => ({
      city,
      cost: parseFloat(cost.toFixed(2)),
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 10); // Top 10 cities

  return (
    <Card className="col-span-1 border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Top 10 Cities by Total Cost ($)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
              />
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor' }}
                className="text-slate-500 dark:text-slate-400 text-xs"
              />
              <YAxis
                dataKey="city"
                type="category"
                axisLine={false}
                tickLine={false}
                width={100}
                tick={{ fill: 'currentColor' }}
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
              />
              <Bar dataKey="cost" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
