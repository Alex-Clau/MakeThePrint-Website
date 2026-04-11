"use client";

import { type ReactNode } from "react";
import { Navigation } from "@/components/navigation";

export function AppFallbackShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4">
        {children}
      </div>
    </main>
  );
}
