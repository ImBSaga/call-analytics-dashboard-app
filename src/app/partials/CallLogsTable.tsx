"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CallRecord } from "@/types/CallRecord.type";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  PhoneIncoming,
  PhoneOutgoing,
  MoreHorizontal,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CallLogsTableProps {
  data: CallRecord[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
  onEdit?: (record: CallRecord) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export default function CallLogsTable({
  data,
  pagination,
  onPageChange,
  isLoading,
  isAdmin,
  onEdit,
  onDelete,
  onCreate,
}: CallLogsTableProps) {
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;

  return (
    <Card className="border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Detailed Call Logs</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Showing {data.length} of {pagination?.total || 0} total records
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              size="sm"
              onClick={onCreate}
              className="h-8 gap-1.5 shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Create Record</span>
            </Button>
          )}

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-sm text-muted-foreground mr-1">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/50 dark:bg-slate-950/20">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="w-[180px]">Caller</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Duration</TableHead>
                <TableHead className="text-center">Cost</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
                {isAdmin && (
                  <TableHead className="w-[80px] text-center">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell
                      colSpan={isAdmin ? 9 : 8}
                      className="h-16 animate-pulse"
                    >
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 9 : 8}
                    className="text-center py-20 text-muted-foreground"
                  >
                    No matching call records found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((record) => (
                  <TableRow
                    key={record.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell>
                      <div className="font-semibold text-sm">
                        {record.callerName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {record.callerNumber}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {record.receiverNumber}
                    </TableCell>
                    <TableCell className="text-sm">{record.city}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {record.callDirection ? (
                          <div
                            className="p-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            title="Inbound"
                          >
                            <PhoneIncoming className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div
                            className="p-1.5 rounded-full bg-orange-100/50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                            title="Outbound"
                          >
                            <PhoneOutgoing className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm tabular-nums">
                      {record.callDuration}s
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                      £{parseFloat(record.callCost).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={record.callStatus ? "default" : "destructive"}
                        className={
                          record.callStatus
                            ? "bg-emerald-500 hover:bg-emerald-600 border-none px-2 py-0.5 text-[10px]"
                            : "border-none px-2 py-0.5 text-[10px]"
                        }
                      >
                        {record.callStatus ? "Success" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap text-xs text-muted-foreground tabular-nums">
                      {format(
                        parseISO(
                          record.callStartTime.includes(" ")
                            ? record.callStartTime.replace(" ", "T")
                            : record.callStartTime,
                        ),
                        "MMM d, HH:mm:ss",
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit?.(record)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Record</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => onDelete?.(record.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete Record</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
