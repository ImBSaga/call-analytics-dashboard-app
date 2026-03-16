import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import AppProvider from "@/providers/AppProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Call Analytics Dashboard",
  description: "Monitor and analyze telecommunication call data records (CDR).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", geist.variable)}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
