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
