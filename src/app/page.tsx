"use client";

import { useCallRecords } from "@/hooks/useCallRecords";
import KPIStats from "./partials/KPIStats";
import DurationAnalytics from "./partials/DurationAnalytics";
import CostAnalytics from "./partials/CostAnalytics";
import TimelineAnalytics from "./partials/TimelineAnalytics";
import CityAnalytics from "./partials/CityAnalytics";
import CallLogsTable from "./partials/CallLogsTable";
import { Skeleton } from "@/components/ui/skeleton";
import ThemeToggle from "@/components/container/ThemeToggle";
import { 
  FadeIn, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/animations/MotionWrapper";

export default function Home() {
  const { data, analytics, loading, error } = useCallRecords();

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 space-y-8 text-foreground transition-colors duration-300">
      {/* Dashboard Top Section */}
      <FadeIn initial={{ y: -20, opacity: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your telecommunication performance and costs.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-muted-foreground bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 backdrop-blur-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <ThemeToggle />
        </div>
      </FadeIn>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <StaggerContainer className="space-y-8">
          {/* Main Key Performance Indicators */}
          <StaggerItem>
            <KPIStats analytics={analytics} />
          </StaggerItem>

          {/* Primary Analytics Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <StaggerItem>
              <DurationAnalytics analytics={analytics} />
            </StaggerItem>
            <StaggerItem>
              <CityAnalytics analytics={analytics} />
            </StaggerItem>
            <StaggerItem>
              <CostAnalytics analytics={analytics} />
            </StaggerItem>
          </div>

          {/* Call Frequency Timeline */}
          <StaggerItem>
            <TimelineAnalytics analytics={analytics} />
          </StaggerItem>

          {/* Detailed Call Logs */}
          <StaggerItem>
            <CallLogsTable data={data} />
          </StaggerItem>
        </StaggerContainer>
      )}
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[380px] w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[380px] w-full rounded-xl" />
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  );
}
