'use client';

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { SidebarProvider } from "./SidebarContext";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className={cn(
        "flex-1 p-8 bg-muted/40 transition-all duration-300",
        isCollapsed ? "ml-0" : "ml-0"
      )}>
        <AdminHeader />
        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "max-w-full" : "max-w-full"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}
