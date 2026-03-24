"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CallRecord } from "@/types/CallRecord.type";
import { Loader2 } from "lucide-react";

interface CDRFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  record?: CallRecord | null;
  isLoading?: boolean;
}

export default function CDRFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  record, 
  isLoading 
}: CDRFormDialogProps) {
  const [formData, setFormData] = useState<any>({
    callerName: "",
    callerNumber: "",
    receiverNumber: "",
    city: "",
    callDirection: "true",
    callStatus: "true",
    callDuration: 0,
    callCost: "0.00",
    callStartTime: new Date().toISOString().slice(0, 16),
    callEndTime: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (record) {
      setFormData({
        ...record,
        callDirection: String(record.callDirection),
        callStatus: String(record.callStatus),
        callStartTime: record.callStartTime.slice(0, 16).replace(' ', 'T'),
        callEndTime: record.callEndTime.slice(0, 16).replace(' ', 'T'),
      });
    } else {
      setFormData({
        callerName: "",
        callerNumber: "",
        receiverNumber: "",
        city: "",
        callDirection: "true",
        callStatus: "true",
        callDuration: 0,
        callCost: "0.00",
        callStartTime: new Date().toISOString().slice(0, 16),
        callEndTime: new Date().toISOString().slice(0, 16),
      });
    }
  }, [record, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      callDirection: formData.callDirection === "true",
      callStatus: formData.callStatus === "true",
      callDuration: Number(formData.callDuration),
      callStartTime: formData.callStartTime.replace('T', ' '),
      callEndTime: formData.callEndTime.replace('T', ' '),
    };
    await onSubmit(formattedData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50">{record ? "Edit Call Record" : "Add New Call Record"}</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {record ? "Modify existing record details below." : "Enter the details for the new call record."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="callerName" className="dark:text-slate-300">Caller Name</Label>
              <Input id="callerName" name="callerName" value={formData.callerName} onChange={handleChange} required className="dark:bg-slate-950 dark:border-slate-700" />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="callerNumber" className="dark:text-slate-300">Caller Number</Label>
              <Input id="callerNumber" name="callerNumber" value={formData.callerNumber} onChange={handleChange} required className="dark:bg-slate-950 dark:border-slate-700" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="receiverNumber" className="dark:text-slate-300">Receiver Number</Label>
              <Input id="receiverNumber" name="receiverNumber" value={formData.receiverNumber} onChange={handleChange} required className="dark:bg-slate-950 dark:border-slate-700" />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="city" className="dark:text-slate-300">City</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} required className="dark:bg-slate-950 dark:border-slate-700" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <Label>Call Direction</Label>
              <Select 
                value={formData.callDirection} 
                onValueChange={(val) => setFormData((prev: any) => ({...prev, callDirection: val}))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Inbound</SelectItem>
                  <SelectItem value="false">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 text-left">
              <Label>Call Status</Label>
              <Select 
                value={formData.callStatus} 
                onValueChange={(val) => setFormData((prev: any) => ({...prev, callStatus: val}))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Success</SelectItem>
                  <SelectItem value="false">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="callDuration" className="dark:text-slate-300">Duration (seconds)</Label>
              <Input id="callDuration" name="callDuration" type="number" value={formData.callDuration} onChange={handleChange} required className="dark:bg-slate-950 dark:border-slate-700" />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="callCost" className="dark:text-slate-300">Cost (£)</Label>
              <Input id="callCost" name="callCost" value={formData.callCost} onChange={handleChange} required className="dark:bg-slate-950 dark:border-slate-700" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="callStartTime" className="dark:text-slate-300">Start Time</Label>
              <Input id="callStartTime" name="callStartTime" type="datetime-local" value={formData.callStartTime} onChange={handleChange} required className="dark:bg-slate-950 dark:border-slate-700 scheme-dark" />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="callEndTime" className="dark:text-slate-300">End Time</Label>
              <Input id="callEndTime" name="callEndTime" type="datetime-local" value={formData.callEndTime} onChange={handleChange} required className="dark:bg-slate-950 dark:border-slate-700 scheme-dark" />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {record ? "Update Record" : "Create Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
