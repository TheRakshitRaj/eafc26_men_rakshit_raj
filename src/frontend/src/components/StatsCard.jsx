import React from 'react';

export default function StatsCard({ label, value, icon: Icon, trend }) {
  // trend can be an object: { value: '12%', up: true }
  
  return (
    <div className="bg-[#111111] border border-[#222222] hover:border-[#00FF87] hover:shadow-[0_0_20px_rgba(0,255,135,0.1)] rounded-xl p-5 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center space-x-4">
        {/* Left Side: Icon Container */}
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center text-[#00FF87]">
            <Icon className="text-xl" />
          </div>
        )}

        {/* Right Side: Data */}
        <div className="flex flex-col">
          <span className="text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
            {label}
          </span>
          <span className="text-2xl font-mono font-extrabold text-white mt-0.5 tracking-tight">
            {value}
          </span>
        </div>
      </div>

      {/* Optional Trend Percentage Badge */}
      {trend && (
        <div
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            trend.up
              ? 'bg-[#00FF87]/10 text-[#00FF87]'
              : 'bg-red-500/10 text-red-500'
          }`}
        >
          <span>{trend.up ? '↑' : '↓'}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
