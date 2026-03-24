import { useQuery } from "@tanstack/react-query";
import { getCallRecords } from "@/services/callRecords.service";
import { getCallAnalytics } from "@/services/analytics.service";
import { useState, useMemo } from "react";
import type { CDRFilters } from "@/types/CallRecord.type";

export function useCallRecords() {
  const [filters, setFilters] = useState<CDRFilters>({
    page: 1,
    limit: 10,
    city: "",
    status: "",
    direction: "",
    caller: "",
    receiver: "",
  });

  // Fetch paginated records
  const {
    data: recordsData,
    isLoading: recordsLoading,
    isError: recordsError,
    error: recordsFetchError,
    refetch: refetchRecords,
  } = useQuery({
    queryKey: ["call-records", filters],
    queryFn: () => getCallRecords(filters),
  });

  // Fetch analytics summary (independent of pagination, but using other filters)
  const analyticsFilters = useMemo(() => {
    const { page, limit, ...rest } = filters;
    return rest;
  }, [filters]);

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    isError: analyticsError,
    error: analyticsFetchError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["call-analytics", analyticsFilters],
    queryFn: () => getCallAnalytics(analyticsFilters),
  });

  const updateFilters = (newFilters: Partial<CDRFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1,
    }));
  };

  const refetch = () => {
    refetchRecords();
    refetchAnalytics();
  };

  const error = useMemo(() => {
    if (recordsError) return (recordsFetchError as Error).message;
    if (analyticsError) return (analyticsFetchError as Error).message;
    return null;
  }, [recordsError, analyticsError, recordsFetchError, analyticsFetchError]);

  return {
    data: recordsData?.data || [],
    pagination: recordsData?.pagination,
    analytics: analyticsData || {
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
    },
    loading: recordsLoading || analyticsLoading,
    error,
    filters,
    updateFilters,
    refetch,
  };
}
