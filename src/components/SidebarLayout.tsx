import * as React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface SidebarLayoutProps {
  currentPath: string;
  children: React.ReactNode;
}

export function SidebarLayout({ currentPath, children }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-canvas">
        <AppSidebar currentPath={currentPath} />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
