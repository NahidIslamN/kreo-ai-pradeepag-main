/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Ban, ChevronLeft, ChevronRight, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAllUsersQuery, useSuspendUserMutation, useActivateUserMutation } from "@/redux/feature/userSlice";
import { toast } from "sonner";
import Image from "next/image";

interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  gender: string | null;
  age: number;
  is_active: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  user_type: string;
  created_at: string;
  image: string | null;
  status?: boolean;
  plan?: string;
  payment?: string;
  coin_status?: {
    used: number;
    left: number;
  };
  image_count?: number;
  video_count?: number;
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusToggleUser, setStatusToggleUser] = useState<User | null>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchVal);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchVal]);

  // Queries & Mutations
  const { data: allUsersResponse, isLoading: isFetching } = useAllUsersQuery({
    search: searchQuery || undefined,
    page: currentPage,
  });

  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();

  const isToggling = isSuspending || isActivating;

  const users: User[] = allUsersResponse?.data || [];
  const meta = allUsersResponse?.meta;

  // Filter users based on tabs (All, New, Active, Suspend)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const isUserActive = user.is_active;

      if (activeTab === "Active") {
        return isUserActive;
      }
      if (activeTab === "Suspend") {
        return !isUserActive;
      }
      if (activeTab === "New") {
        // Users created within the last 14 days
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return new Date(user.created_at) >= twoWeeksAgo;
      }
      return true; // All
    });
  }, [users, activeTab]);

  const handleConfirmToggleStatus = async () => {
    if (!statusToggleUser) return;
    const isCurrentlyActive = statusToggleUser.is_active;
    try {
      let res;
      if (isCurrentlyActive) {
        res = await suspendUser(statusToggleUser.id).unwrap();
      } else {
        res = await activateUser(statusToggleUser.id).unwrap();
      }
      toast.success(res?.message || `User successfully ${isCurrentlyActive ? "suspended" : "activated"}!`);
      setStatusToggleUser(null);
    } catch (error: any) {
      console.error("Toggle user status error:", error);
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const getPaginationRange = (current: number, total: number) => {
    const range: (number | string)[] = [];
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        range.push(i);
      }
      return range;
    }

    range.push(1);

    if (current > 3) {
      range.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (current < total - 2) {
      range.push("...");
    }

    range.push(total);

    return range;
  };

  return (
    <div className="bg-[#242424] rounded-xl p-6 shadow-sm flex flex-col h-full min-h-[600px] text-white relative">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#3E3E3E] w-full sm:w-auto">
          {["All", "New", "Active", "Suspend"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? "text-[#FF9F05]" : "text-[#A3A3A3] hover:text-white"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#FF9F05]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#A3A3A3]" />
          </div>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search Users"
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-[#3E3E3E] rounded-lg text-sm text-white placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#777777] focus:ring-1 focus:ring-[#777777] transition-all"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#A3A3A3]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF9F05]" />
            <p className="text-sm">Fetching users list...</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="text-[#A3A3A3] text-sm border-b border-[#3E3E3E]">
                  <th className="py-4 pl-4 pr-2 font-medium w-12">
                    <input type="checkbox" className="rounded bg-[#3E3E3E] border-none accent-[#FF9F05]" />
                  </th>
                  <th className="py-4 px-4 font-medium">Users</th>
                  <th className="py-4 px-4 font-medium">Gmail</th>
                  <th className="py-4 px-4 font-medium">Plan</th>
                  <th className="py-4 px-4 font-medium">Payment</th>
                  <th className="py-4 px-4 font-medium w-48">Coin Status</th>
                  <th className="py-4 px-4 font-medium">Image</th>
                  <th className="py-4 px-4 font-medium">Video</th>
                  <th className="py-4 px-4 font-medium">Status</th>
                  <th className="py-4 pr-4 pl-2 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const coinsUsed = user.coin_status?.used ?? 0;
                  const coinsLeft = user.coin_status?.left ?? 0;
                  const imageGenerations = user.image_count ?? 0;
                  const videoGenerations = user.video_count ?? 0;
                  const plan = user.plan ?? "Free";
                  const payment = user.payment ?? "$0";

                  const totalCoins = coinsUsed + coinsLeft;
                  const coinsPercentage = totalCoins > 0 ? (coinsUsed / totalCoins) * 100 : 0;

                  const firstLetter = (user.full_name || user.email || "U")[0].toUpperCase();

                  return (
                    <tr key={user.id} className="border-b border-[#3E3E3E] hover:bg-white/5 transition-colors group">
                      <td className="py-4 pl-4 pr-2">
                        <input type="checkbox" className="rounded bg-[#3E3E3E] border-none accent-[#FF9F05]" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#3E3E3E] shrink-0 border border-white/10">
                              <Image
                                width={100}
                                height={100}
                                src={user.image}
                                alt={user.full_name || "User Profile"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#FF9F05]/10 border border-[#FF9F05]/30 flex items-center justify-center shrink-0 text-[#FF9F05] text-sm font-semibold">
                              {firstLetter}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                              {user.full_name || "Anonymous User"}
                            </span>
                            <span className="text-xs text-[#A3A3A3]">#{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#CCCCCC]">{user.email}</td>
                      <td className="py-4 px-4 text-sm text-[#CCCCCC]">{plan}</td>
                      <td className="py-4 px-4 text-sm text-[#CCCCCC]">{payment}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1.5 w-full pr-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-white">{coinsUsed} used</span>
                            <span className="text-white">{coinsLeft} left</span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-[#3E3E3E] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#FF9F05] h-full rounded-full"
                              style={{ width: `${coinsPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#CCCCCC]">{imageGenerations}</td>
                      <td className="py-4 px-4 text-sm text-[#CCCCCC]">{videoGenerations}</td>
                      <td className="py-4 px-4 text-sm">
                        <span className={user.is_active ? "text-[#00E573]" : "text-[#FF4C4C]"}>
                          {user.is_active ? "Active" : "Suspend"}
                        </span>
                      </td>
                      <td className="py-4 pr-4 pl-2 text-center">
                        <button
                          onClick={() => setStatusToggleUser(user)}
                          className={`transition-colors p-1.5 rounded-lg hover:bg-white/10 ${user.is_active
                            ? "text-[#A3A3A3] hover:text-[#FF4C4C]"
                            : "text-[#A3A3A3] hover:text-[#00E573]"
                            }`}
                          title={user.is_active ? "Suspend User" : "Activate User"}
                          aria-label={user.is_active ? "Suspend User" : "Activate User"}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-[#A3A3A3] text-sm">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {meta && meta.total_pages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2 pb-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[#A3A3A3] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPaginationRange(currentPage, meta.total_pages).map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span key={`ellipsis-${idx}`} className="text-[#A3A3A3] px-1 text-sm select-none">
                        ..
                      </span>
                    );
                  }

                  const pNum = page as number;
                  return (
                    <button
                      key={`page-${pNum}`}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-medium text-sm transition-colors ${currentPage === pNum
                        ? "bg-[#FF9F05] text-[#242424]"
                        : "text-[#A3A3A3] hover:bg-white/10"
                        }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.total_pages))}
                  disabled={currentPage === meta.total_pages}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[#A3A3A3] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Status Toggle Modal */}
      {statusToggleUser !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#2C2C2C] border border-[#3E3E3E] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center gap-3 text-[#FF9F05]">
              <div className="bg-[#FF9F05]/10 p-2.5 rounded-full border border-[#FF9F05]/20">
                {statusToggleUser.is_active ? (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {statusToggleUser.is_active ? "Suspend User?" : "Activate User?"}
              </h3>
            </div>

            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              Are you sure you want to {statusToggleUser.is_active ? "suspend" : "activate"}{" "}
              <strong className="text-white">{statusToggleUser.full_name || "this user"}</strong>?{" "}
              {statusToggleUser.is_active
                ? "Banning them will temporarily prevent them from logging in and using their dashboard."
                : "This will restore their normal access and grant them dashboard privileges again."}
            </p>

            <div className="flex items-center gap-3 mt-2 justify-end">
              <button
                onClick={() => setStatusToggleUser(null)}
                disabled={isToggling}
                className="px-5 py-2.5 rounded-full bg-[#3E3E3E] text-white text-sm font-medium hover:bg-[#4a4a4a] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggleStatus}
                disabled={isToggling}
                className={`px-5 py-2.5 rounded-full text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${statusToggleUser.is_active
                  ? "bg-[#FF4C4C] hover:bg-[#FF4C4C]/90"
                  : "bg-[#00E573] hover:bg-[#00E573]/90 text-[#242424] font-semibold"
                  }`}
              >
                {isToggling && <Loader2 className="w-4 h-4 animate-spin" />}
                {statusToggleUser.is_active ? "Suspend" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


