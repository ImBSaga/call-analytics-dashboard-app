"use client";

import { useEffect } from "react";
import ErrorScreen from "@/components/container/ErrorScreen";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorScreen
      title="Application Error"
      message={error.message || "An unexpected error occurred in the application dashboard."}
      onRetry={reset}
    />
  );
}
