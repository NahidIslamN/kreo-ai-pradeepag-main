"use client";

import React, { createContext, useContext, useState } from "react";

interface SidebarContextType {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isMobileSidebarOpen: false,
  setIsMobileSidebarOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isMobileSidebarOpen, setIsMobileSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
