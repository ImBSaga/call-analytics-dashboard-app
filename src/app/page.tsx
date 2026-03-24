"use client";

import { useState, useEffect } from "react";
import { useCallRecords } from "@/hooks/useCallRecords";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import KPIStats from "./partials/KPIStats";
import DurationAnalytics from "./partials/DurationAnalytics";
import CostAnalytics from "./partials/CostAnalytics";
import TimelineAnalytics from "./partials/TimelineAnalytics";
import CityAnalytics from "./partials/CityAnalytics";
import CallLogsTable from "./partials/CallLogsTable";
import DashboardFilters from "./partials/DashboardFilters";
import CDRFormDialog from "./partials/CDRFormDialog";
import ThemeToggle from "@/components/container/ThemeToggle";
import ErrorScreen from "@/components/container/ErrorScreen";
import { Button } from "@/components/ui/button";
import { createCallRecord, updateCallRecord, deleteCallRecord } from "@/services/callRecords.service";
import { 
  LogOut, 
  User as UserIcon,
  RefreshCcw,
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";
import { 
  FadeIn, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/animations/MotionWrapper";

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';
  
  const { 
    data, 
    pagination, 
    analytics, 
    loading: dataLoading, 
    error, 
    filters,
    updateFilters,
    refetch 
  } = useCallRecords();

  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [crudLoading, setCrudLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!dataLoading) {
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [dataLoading]);

  // ─── ADMIN ACTIONS ─────────────────────────────────────────────────────────

  const handleCreate = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setCrudLoading(true);
    try {
      await deleteCallRecord(id);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete record.");
    } finally {
      setCrudLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setCrudLoading(true);
    try {
      if (editingRecord) {
        await updateCallRecord(editingRecord.id, formData);
      } else {
        await createCallRecord(formData);
      }
      setFormOpen(false);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save record.");
    } finally {
      setCrudLoading(false);
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={() => refetch()} />;
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8 space-y-8 text-foreground transition-colors duration-300">
      {/* Dashboard Top Section */}
      <FadeIn initial={{ y: -20, opacity: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              <span className="font-medium text-foreground">PineVox</span> • Telecom CDR Intelligence
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200/50 text-xs font-bold animate-pulse">
              <ShieldCheck className="h-3 w-3" />
              <span>Admin Mode</span>
            </div>
          )}
          
          <div className="h-10 w-0.5 bg-border mx-2 hidden sm:block" />

          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 p-1 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm">
            <div className="px-3 py-1.5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground leading-tight capitalize">{user?.role}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout} 
              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <ThemeToggle />
        </div>
      </FadeIn>

      <StaggerContainer className="space-y-8">
        {/* Filters Section */}
        <StaggerItem>
          <DashboardFilters filters={filters} onFilterChange={updateFilters} />
        </StaggerItem>

        <StaggerItem>
          <KPIStats analytics={analytics} isLoading={dataLoading} />
        </StaggerItem>

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

        <StaggerItem>
          <TimelineAnalytics analytics={analytics} />
        </StaggerItem>

        <StaggerItem>
          <CallLogsTable 
            data={data} 
            pagination={pagination} 
            onPageChange={(page) => updateFilters({ page })} 
            isLoading={dataLoading || crudLoading}
            isAdmin={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </StaggerItem>
      </StaggerContainer>

      {/* Admin Modification Form */}
      <CDRFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        onSubmit={handleFormSubmit}
        record={editingRecord}
        isLoading={crudLoading}
      />
    </main>
  );
}
