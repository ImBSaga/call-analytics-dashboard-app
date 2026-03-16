"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CallAnalytics } from "@/types/CallRecord.type";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CHART_COLORS } from "@/constants/statsData";

interface CityAnalyticsProps {
  analytics: CallAnalytics;
}

export default function CityAnalytics({ analytics }: CityAnalyticsProps) {
  const data = Object.entries(analytics.callsByCity)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 cities

  return (
    <Card className="col-span-1 border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Calls by City (Top 5)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
