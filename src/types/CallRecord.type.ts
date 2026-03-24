export type CallRecord = {
  callerName: string;
  callerNumber: string;
  receiverNumber: string;
  city: string;
  callDirection: boolean; // True: Inbound, False: Outbound
  callStatus: boolean; // True: Successful, False: Unsuccessful
  callDuration: number;
  callCost: string;
  callStartTime: string;
  callEndTime: string;
  id: string;
};

export type CallAnalytics = {
  totalCalls: number;
  totalCost: number;
  avgDuration: number;
  successfulCalls: number;
  failedCalls: number;
  longestCall: CallRecord | null;
  shortestCall: CallRecord | null;
  costsByCity: Record<string, number>;
  callsByCity: Record<string, number>;
  callsByHour: Record<number, number>;
  callsByDay: Record<string, number>;
};

export type CDRFilters = {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  caller?: string;
  receiver?: string;
  city?: string;
  direction?: "inbound" | "outbound" | "";
  status?: "success" | "failed" | "";
};

export type PaginatedCDR = {
  data: CallRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
