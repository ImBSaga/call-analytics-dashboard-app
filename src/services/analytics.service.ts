import { api } from "@/lib/api/axiosInstance";
import type { CallAnalytics } from "@/types/CallRecord.type";
import type { AnalyticsFilters } from "@/types/Analytics.type";

const prefix = "/analytics";

export async function getCallAnalytics(
  filters: AnalyticsFilters = {},
): Promise<CallAnalytics> {
  // Strip empty string values so they aren't sent as query params
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null,
    ),
  );

  const res = await api.get<{ success: boolean; data: any }>(prefix, {
    params,
  });

  const raw = res.data.data;

  return {
    totalCalls: raw.totalCalls,
    totalCost: raw.totalCost,
    avgDuration: raw.avgDuration,
    successfulCalls: raw.successfulCalls,
    failedCalls: raw.failedCalls,
    longestCall: null,
    shortestCall: null,
    costsByCity: raw.costsByCity,
    callsByCity: raw.callsByCity,
    callsByHour: raw.callsByHour,
    callsByDay: raw.callsByDay,
  } as CallAnalytics;
}
