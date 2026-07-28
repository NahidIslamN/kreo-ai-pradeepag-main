import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number; // e.g., 12 for +12%
}

export default function MetricCard({ title, value, trend }: MetricCardProps) {
  const showTrend = trend !== undefined;
  const isPositive = trend !== undefined ? trend >= 0 : true;

  return (
    <div className="bg-[#242424] rounded-xl p-6 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#A3A3A3] text-sm font-medium">{title}</h3>
        {showTrend && (
          <div 
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              isPositive 
                ? "bg-[#054F31]/20 text-[#00E573]" 
                : "bg-[#7A1E1E]/20 text-[#FF4C4C]"
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-white text-3xl font-medium">
        {value}
      </div>
    </div>
  );
}
