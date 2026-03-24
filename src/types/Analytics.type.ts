export type AnalyticsFilters = {
  startDate?: string;
  endDate?: string;
  city?: string;
  direction?: "inbound" | "outbound" | "";
  status?: "success" | "failed" | "";
};
