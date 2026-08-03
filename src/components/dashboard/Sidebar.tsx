"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  HelpCircle,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  // { name: "Plan & Pricing", href: "/dashboard/plan", icon: CreditCard },
  { name: "FAQ", href: "/dashboard/faq", icon: HelpCircle },
  { name: "Legacy & Policy", href: "/dashboard/policy", icon: ShieldCheck },
  { name: "Manage Template", href: "/dashboard/templates", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useSidebar();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-[266px] h-screen bg-[#242424] flex flex-col flex-shrink-0 fixed lg:sticky top-0 left-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-center py-8 shrink-0">
          <Image src="/image.png" alt="logo" width={400} height={400} className="w-[65px] h-auto object-contain" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 flex flex-col gap-[14px] ">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-2  transition-all group ${isActive
                  ? "bg-white text-[#242424] rounded-t-[20px] shadow-sm"
                  : "text-[#A3A3A3] hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#242424]" : "text-[#A3A3A3] group-hover:text-white"}`} />
                <span className={`text-[18px] font-normal ${isActive ? "text-[#242424]" : ""}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Area */}
        <div className="p-8 shrink-0">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 text-[#A3A3A3] hover:text-white transition-colors w-full group"
          >
            <LogOut className="w-5 h-5 group-hover:text-white" />
            <span className="text-[15px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
