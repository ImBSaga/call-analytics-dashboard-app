import { useQuery } from "@tanstack/react-query";
import { getCallRecords } from "@/services/callRecords.service";
import type { CallAnalytics } from "@/types/CallRecord.type";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";

export function useCallRecords() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["call-records"],
    queryFn: getCallRecords,
  });

  const analytics = useMemo<CallAnalytics>(() => {
    if (!data || data.length === 0) {
      return {
        totalCalls: 0,
        totalCost: 0,
        avgDuration: 0,
        successfulCalls: 0,
        failedCalls: 0,
        longestCall: null,
        shortestCall: null,
        costsByCity: {},
        callsByCity: {},
        callsByHour: {},
        callsByDay: {},
      };
    }

    let totalCost = 0;
    let totalDuration = 0;
    let successfulCalls = 0;
    let failedCalls = 0;
    let longestCall = data[0];
    let shortestCall = data[0];
    const costsByCity: Record<string, number> = {};
    const callsByCity: Record<string, number> = {};
    const callsByHour: Record<number, number> = {};
    const callsByDay: Record<string, number> = {};

    data.forEach((record) => {
      const cost = parseFloat(record.callCost);
      totalCost += cost;
      totalDuration += record.callDuration;

      if (record.callStatus) successfulCalls++;
      else failedCalls++;

      if (record.callDuration > longestCall.callDuration) longestCall = record;
      if (record.callDuration < shortestCall.callDuration)
        shortestCall = record;

      costsByCity[record.city] = (costsByCity[record.city] || 0) + cost;
      callsByCity[record.city] = (callsByCity[record.city] || 0) + 1;

      const date = parseISO(record.callStartTime);
      const hour = date.getHours();
      const day = format(date, "yyyy-MM-dd");

      callsByHour[hour] = (callsByHour[hour] || 0) + 1;
      callsByDay[day] = (callsByDay[day] || 0) + 1;
    });

    return {
      totalCalls: data.length,
      totalCost,
      avgDuration: totalDuration / data.length,
      successfulCalls,
      failedCalls,
      longestCall,
      shortestCall,
      costsByCity,
      callsByCity,
      callsByHour,
      callsByDay,
    };
  }, [data]);

  return {
    data: data || [],
    analytics,
    loading: isLoading,
    error: isError ? (error as Error).message : null,
    refetch,
  };
}
