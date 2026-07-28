import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen font-sans text-[#242424]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
            <div className="mx-auto w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
