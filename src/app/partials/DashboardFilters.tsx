"use client";

import { useQuery } from "@tanstack/react-query";
import { getAvailableCities } from "@/services/callRecords.service";
import type { CDRFilters } from "@/types/CallRecord.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Activity, ArrowUpDown } from "lucide-react";

interface DashboardFiltersProps {
  filters: CDRFilters;
  onFilterChange: (newFilters: Partial<CDRFilters>) => void;
}

export default function DashboardFilters({
  filters,
  onFilterChange,
}: DashboardFiltersProps) {
  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: getAvailableCities,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800 shadow-sm">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
          Search Caller
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Name or number..."
            className="pl-10 h-10"
            value={filters.caller || ""}
            onChange={(e) =>
              onFilterChange({ caller: e.target.value, page: 1 })
            }
          />
        </div>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
          City
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <Select
            value={filters.city || "all"}
            onValueChange={(val) =>
              onFilterChange({ city: val === "all" ? "" : val, page: 1 })
            }
          >
            <SelectTrigger className="pl-10 h-10">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
          Status
        </label>
        <div className="relative">
          <Activity className="absolute left-3 top-2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <Select
            value={filters.status || "all"}
            onValueChange={(val) =>
              onFilterChange({
                status: val === "all" ? "" : (val as any),
                page: 1,
              })
            }
          >
            <SelectTrigger className="pl-10 h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Direction Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
          Direction
        </label>
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <Select
            value={filters.direction || "all"}
            onValueChange={(val) =>
              onFilterChange({
                direction: val === "all" ? "" : (val as any),
                page: 1,
              })
            }
          >
            <SelectTrigger className="pl-10 h-10">
              <SelectValue placeholder="All Directions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Directions</SelectItem>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
