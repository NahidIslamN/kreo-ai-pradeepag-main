/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import { useAdminDashboardAnylizesQuery } from "@/redux/feature/userSlice";
import { Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

const PLAN_COLORS = ["#FFFFFF", "#FF9F05", "#0088FE", "#F84F4F", "#00E573"];

export default function DashboardPage() {
  const { data: analyticsData, isLoading } = useAdminDashboardAnylizesQuery(undefined);
  const [activeGeneratedTab, setActiveGeneratedTab] = useState<"image" | "video">("image");

  // 1. Metrics Mapping
  const metrics = useMemo(() => {
    const overview = analyticsData?.platform_overviews;
    return [
      { title: "Total Users", value: String(overview?.total_users ?? 0), trend: overview?.total_users_growth },
      { title: "Active Users", value: String(overview?.active_users ?? 0), trend: overview?.active_users_growth },
      { title: "Credits Consumed", value: String(overview?.credits_consumed ?? 0), trend: overview?.credits_consumed_growth },
      { title: "API Cost", value: `$${(overview?.api_cost ?? 0).toFixed(2)}`, trend: overview?.api_cost_growth },
      { title: "Revenue", value: `$${(overview?.revenue ?? 0).toLocaleString()}`, trend: overview?.revenue_growth },
    ];
  }, [analyticsData]);

  // 2. Generated Area Chart Data Mapping
  const generatedData = useMemo(() => {
    const list = analyticsData?.generated_chart || [];
    if (list.length === 0) {
      return [{ day: "No Data", value: 0 }];
    }
    return list.map((item: any) => ({
      day: item.date || "",
      value: activeGeneratedTab === "image" ? (item.image || 0) : (item.video || 0),
    }));
  }, [analyticsData, activeGeneratedTab]);

  // 3. Comparison Pie Chart Data Mapping
  const comparisonData = useMemo(() => {
    const comparison = analyticsData?.comparison;
    const imgCount = comparison?.image?.count ?? 0;
    const vidCount = comparison?.video?.count ?? 0;
    return [
      { name: "Image", value: imgCount, color: "#F84F4F" },
      { name: "Video", value: vidCount, color: "#FFFFFF" },
    ];
  }, [analyticsData]);

  const totalComparisonCount = analyticsData?.comparison?.total ?? 0;

  // 4. Role Distribution Data Mapping
  const roleData = useMemo(() => {
    const list = analyticsData?.role_distribution || [];
    return list.map((item: any, idx: number) => ({
      name: item.plan || "Unknown Plan",
      value: item.users || 0,
      color: PLAN_COLORS[idx % PLAN_COLORS.length],
    }));
  }, [analyticsData]);

  // 5. Credits Use Data Mapping
  const creditsData = useMemo(() => {
    const list = analyticsData?.credits_use || [];
    return list.map((item: any) => ({
      month: item.month || "",
      value: item.value || 0,
    }));
  }, [analyticsData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] h-full gap-3 text-[#A3A3A3]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9F05]" />
        <p className="text-sm font-medium">Loading dashboard overview...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric, i) => (
          <MetricCard
            key={i}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Middle Row: Area Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generated Area Chart */}
        <div className="lg:col-span-2 bg-[#242424] rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-white font-medium text-lg">Generated</h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveGeneratedTab("image")}
                  className={`font-medium transition-colors ${activeGeneratedTab === "image" ? "text-[#FF9F05]" : "text-[#A3A3A3] hover:text-white"}`}
                >
                  Image
                </button>
                <button
                  onClick={() => setActiveGeneratedTab("video")}
                  className={`font-medium transition-colors ${activeGeneratedTab === "video" ? "text-[#FF9F05]" : "text-[#A3A3A3] hover:text-white"}`}
                >
                  Video
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generatedData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGenerated" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#2834AF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F35ACD" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#2834AF" stopOpacity={1} />
                    <stop offset="95%" stopColor="#F35ACD" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#colorStroke)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorGenerated)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Donut Chart */}
        <div className="bg-[#242424] rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
          <h2 className="text-white font-medium text-lg mb-4">Comparison</h2>
          <div className="flex items-center gap-6 text-sm mb-4 justify-start">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F84F4F]"></div>
              <span className="text-white">Image</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
              <span className="text-white">Video</span>
            </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={comparisonData}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="85%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {comparisonData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[#A3A3A3] text-sm">Total</span>
              <span className="text-white text-3xl font-medium">{totalComparisonCount}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm pt-4 border-t border-[#3E3E3E] gap-2">
            <div className="text-[#F84F4F] font-medium">
              Image ({analyticsData?.comparison?.image?.count ?? 0}) - {analyticsData?.comparison?.image?.percentage ?? 0}%
            </div>
            <div className="text-white font-medium">
              Video ({analyticsData?.comparison?.video?.count ?? 0}) - {analyticsData?.comparison?.video?.percentage ?? 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Role Distribution & Credits Use */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Distribution Pie Chart */}
        <div className="bg-[#242424] rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
          <h2 className="text-white font-medium text-lg mb-2">Role Distribution</h2>
          <div className="flex-1 relative flex items-center justify-center">
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    dataKey="value"
                    stroke="none"
                  >
                    {roleData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-[#A3A3A3] text-sm">No role data available</div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4 max-h-[120px] overflow-y-auto pr-1">
            {roleData.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[#A3A3A3]">{item.name}</span>
                </div>
                <span className="text-white">{item.value} Users</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credits Use Bar Chart */}
        <div className="lg:col-span-2 bg-[#242424] rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-medium text-lg">Credits Use</h2>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creditsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#3E3E3E', opacity: 0.2 }}
                  contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#00E573' }}
                />
                <Bar dataKey="value" fill="#16A34A" radius={[4, 4, 4, 4]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
