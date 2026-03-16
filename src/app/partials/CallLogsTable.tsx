'use client';

import { useState } from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TABLE_PAGE_SIZE } from "@/constants/statsData";

interface CallLogsTableProps {
  data: CallRecord[];
}

export default function CallLogsTable({ data }: CallLogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / TABLE_PAGE_SIZE);

  const paginatedData = data.slice(
    (currentPage - 1) * TABLE_PAGE_SIZE,
    currentPage * TABLE_PAGE_SIZE
  );

  return (
    <Card className="border-none shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Call Logs</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800">
              <TableRow>
                <TableHead>Caller Name</TableHead>
                <TableHead>Caller Number</TableHead>
                <TableHead>Receiver Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Start Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((record) => (
                <TableRow key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <TableCell className="font-medium">{record.callerName}</TableCell>
                  <TableCell>{record.callerNumber}</TableCell>
                  <TableCell>{record.receiverNumber}</TableCell>
                  <TableCell>{record.city}</TableCell>
                  <TableCell>{record.callDuration}s</TableCell>
                  <TableCell>${parseFloat(record.callCost).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={record.callStatus ? "default" : "destructive"} 
                      className={record.callStatus ? "bg-emerald-500 hover:bg-emerald-600 border-none" : "border-none"}
                    >
                      {record.callStatus ? "Success" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {format(parseISO(record.callStartTime), "MMM d, HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No call records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
