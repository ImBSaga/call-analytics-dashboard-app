"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/MotionWrapper";

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorScreen({
  message = "An unexpected error occurred while loading the dashboard.",
  onRetry,
  title = "Something went wrong",
}: ErrorScreenProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[400px] h-screen w-full items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-950/50">
      <FadeIn initial={{ opacity: 0, scale: 0.95 }} className="max-w-md w-full">
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
          <div className="h-2 bg-destructive" />
          <CardContent className="pt-10 pb-10 px-8 flex flex-col items-center text-center">
            <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <AlertCircle className="size-8 text-destructive" />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
            <p className="text-muted-foreground mb-8 text-balance">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                onClick={handleRetry} 
                variant="default" 
                className="flex-1 gap-2"
              >
                <RefreshCcw className="size-4" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.location.href = "/"}
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
