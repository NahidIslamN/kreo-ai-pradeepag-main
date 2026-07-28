"use client";

import MetricCard from "@/components/dashboard/MetricCard";
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

// Mock Data
const metrics = [
  { title: "Total Users", value: "1282", trend: 12 },
  { title: "Active Users", value: "1000", trend: 12 },
  { title: "Credits Consumed", value: "12k", trend: 12 },
  { title: "API Cost", value: "$1915", trend: 12 },
  { title: "Revenue", value: "$5452", trend: 12 },
];

const generatedData = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 40 },
  { day: "Wed", value: 80 },
  { day: "Thu", value: 140 }, // High point with tooltip in design
  { day: "Fri", value: 90 },
  { day: "Sat", value: 90 },
  { day: "Sun", value: 135 },
];

const comparisonData = [
  { name: "Image", value: 700, color: "#F84F4F" }, // Red
  { name: "Video", value: 500, color: "#FFFFFF" }, // White
];

const roleData = [
  { name: "Free", value: 100, color: "#FFFFFF" },
  { name: "Premium - Monthly", value: 100, color: "#FF9F05" },
  { name: "Premium - Weekly", value: 100, color: "#0088FE" },
];

const creditsData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 900 },
  { month: "March", value: 400 },
  { month: "April", value: 900 },
  { month: "May", value: 1200 },
  { month: "June", value: 1100 },
  { month: "July", value: 750 },
  { month: "Aug", value: 400 },
  { month: "Sep", value: 1100 },
  { month: "Oct", value: 900 },
  { month: "Nov", value: 400 },
  { month: "Dec", value: 900 },
];

export default function DashboardPage() {
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
                <button className="text-[#FF9F05] font-medium">Image</button>
                <button className="text-[#A3A3A3] hover:text-white transition-colors">Video</button>
              </div>
              <div className="hidden sm:block w-px h-4 bg-[#3E3E3E]"></div>
              <div className="flex items-center gap-3 sm:gap-4">
                <button className="text-[#FF9F05] font-medium">Weekly</button>
                <button className="text-[#A3A3A3] hover:text-white transition-colors">Monthly</button>
                <button className="text-[#A3A3A3] hover:text-white transition-colors">Yearly</button>
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
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[#A3A3A3] text-sm">Total</span>
              <span className="text-white text-3xl font-medium">1200</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm pt-4 border-t border-[#3E3E3E]">
            <div className="text-[#F84F4F] font-medium">Image (700) - 60%</div>
            <div className="text-white font-medium">Video (500) - 40%</div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Role Distribution & Credits Use */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Distribution Pie Chart */}
        <div className="bg-[#242424] rounded-xl p-6 shadow-sm flex flex-col h-[350px]">
          <h2 className="text-white font-medium text-lg mb-2">Role Distribution</h2>
          <div className="flex-1 relative flex items-center justify-center">
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
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {roleData.map((item, i) => (
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
            <div className="flex items-center gap-4 text-sm">
              <button className="text-[#FF9F05] font-medium">Weekly</button>
              <button className="text-[#A3A3A3] hover:text-white transition-colors">Monthly</button>
              <button className="text-[#A3A3A3] hover:text-white transition-colors">Yearly</button>
            </div>
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
