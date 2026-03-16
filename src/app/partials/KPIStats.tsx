"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CallAnalytics } from "@/types/CallRecord.type";
import { KPI_CONFIG } from "@/constants/statsData";

interface KPIStatsProps {
  analytics: CallAnalytics;
}

export default function KPIStats({ analytics }: KPIStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {KPI_CONFIG.map((config) => {
        const key = config.key as keyof CallAnalytics;
        const rawValue = analytics[key];
        const numValue = typeof rawValue === "number" ? rawValue : 0;

        let displayValue: string;
        if ("isCurrency" in config && config.isCurrency) {
          displayValue = `£${numValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        } else if ("unit" in config && config.unit) {
          displayValue = `${numValue.toFixed(1)}${config.unit}`;
        } else {
          displayValue = numValue.toString();
        }

        return (
          <Card
            key={config.key}
            className="overflow-hidden border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-lg transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {config.title}
              </CardTitle>
              <config.icon className={`h-4 w-4 ${config.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayValue}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
