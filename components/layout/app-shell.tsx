import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col lg:pb-0 pb-[calc(5.25rem+env(safe-area-inset-bottom))]">
        {children}
        <MobileNav />
      </div>
    </div>
  );
}
