import { Phone, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

export const KPI_CONFIG = [
  {
    key: "totalCalls",
    title: "Total Calls",
    icon: Phone,
    color: "text-blue-500",
  },
  {
    key: "totalCost",
    title: "Total Cost",
    icon: DollarSign,
    color: "text-green-500",
    isCurrency: true,
  },
  {
    key: "avgDuration",
    title: "Avg Duration",
    icon: Clock,
    color: "text-purple-500",
    unit: "s",
  },
  {
    key: "successfulCalls",
    title: "Successful Calls",
    icon: CheckCircle,
    color: "text-emerald-500",
  },
  {
    key: "failedCalls",
    title: "Failed Calls",
    icon: XCircle,
    color: "text-red-500",
  },
] as const;

export const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"] as const;

export const TABLE_PAGE_SIZE = 20;
