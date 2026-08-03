/* eslint-disable @next/next/no-img-element */
"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import NotificationDropdown, { NotificationItem } from "./NotificationDropdown";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAllUsersQuery, useUserProfileQuery } from "@/redux/feature/userSlice";

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "1", title: "New user registered successfully", time: "2024-03-09 - 10:30 AM" },
  { id: "2", title: "Payment received: $49.99 from user ID #1023", time: "2024-03-09 - 10:30 AM" },
  { id: "3", title: "Low storage space remaining (12%)", time: "2024-03-09 - 10:30 AM" },
  { id: "4", title: "Server CPU usage is above normal threshold", time: "2024-03-09 - 10:30 AM" },
  { id: "5", title: "Server CPU usage is above normal threshold", time: "2024-03-09 - 10:30 AM" },
  { id: "6", title: "Server CPU usage is above normal threshold", time: "2024-03-09 - 10:30 AM" },
  { id: "7", title: "Server CPU usage is above normal threshold", time: "2024-03-09 - 10:30 AM" },
  { id: "8", title: "New user registered successfully", time: "2024-03-09 - 10:30 AM" },
];

export default function Header() {
  const pathname = usePathname();
  const { setIsMobileSidebarOpen } = useSidebar();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data } = useUserProfileQuery(undefined);
  console.log(data, 'data of user profile')

  // Get dynamic total user count
  const { data: allUsersResponse } = useAllUsersQuery(undefined);
  const totalUsers = allUsersResponse?.meta?.total_items ?? 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifOpen]);

  const handleDeleteNotif = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleRefreshNotif = () => {
    // In a real app, this would refetch. We'll just restore mock data for demo.
    setNotifications(MOCK_NOTIFICATIONS);
  };

  let title = "Platform Overviews";
  let subtitle = "Real-time performance metrics for Kreo AI";

  if (pathname === "/dashboard/users") {
    title = "User Management";
    subtitle = `(Total - ${totalUsers})`;
  } else if (pathname === "/dashboard/plan") {
    title = "Plan & Pricing";
    subtitle = ""; // No subtitle shown in the design
  } else if (pathname === "/dashboard/faq") {
    title = "FAQ Question";
    subtitle = "";
  } else if (pathname === "/dashboard/policy") {
    title = "Manage Policy";
    subtitle = "";
  } else if (pathname === "/dashboard/templates") {
    title = "Manage Template";
    subtitle = "";
  }

  return (
    <header className="h-20 sm:h-24 px-4 sm:px-8 flex items-center justify-between shrink-0 bg-[#242424] rounded-xl mb-6 shadow-sm mx-4 sm:mx-6 mt-4 sm:mt-6">
      {/* Left side Titles & Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
          <h1 className="text-lg sm:text-2xl font-medium text-white leading-tight">{title}</h1>
          {pathname === "/dashboard/users" && (
            <span className="text-[#00E573] text-sm sm:text-xl">{subtitle}</span>
          )}
          {pathname !== "/dashboard/users" && subtitle && (
            <p className="text-[#A3A3A3] text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right side Profile & Notifications */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-white font-medium text-sm sm:text-lg hidden md:block">{data?.data?.full_name}</span>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#3E3E3E] bg-[#3E3E3E]">
            {/* Using a placeholder avatar since we don't have the real image asset */}
            <img
              src={data?.data?.image}
              alt="Aiden Max"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Notification Bell Area */}
        {/* <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition-colors ${isNotifOpen ? "bg-[#4a4a4a]" : "bg-[#3E3E3E] hover:bg-[#4a4a4a]"
              }`}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF4C4C] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#242424]">
                {notifications.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <NotificationDropdown
              notifications={notifications}
              onDelete={handleDeleteNotif}
              onRefresh={handleRefreshNotif}
              onClose={() => setIsNotifOpen(false)}
            />
          )}
        </div> */}
      </div>
    </header>
  );
}
