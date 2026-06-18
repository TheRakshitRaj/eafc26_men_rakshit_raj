import React, { useState, useEffect } from 'react';
import { FaUndo, FaFilter, FaChevronDown } from 'react-icons/fa';

export default function Filters({ filters, onChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync state if filters change externally (e.g. from url query params)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const positionsList = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF'];

  const handleTextChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePositionToggle = (pos) => {
    setLocalFilters((prev) => {
      const current = prev.positions || [];
      const updated = current.includes(pos)
        ? current.filter((p) => p !== pos)
        : [...current, pos];
      return { ...prev, positions: updated };
    });
  };

  const handleFootChange = (foot) => {
    setLocalFilters((prev) => ({
      ...prev,
      preferredFoot: prev.preferredFoot === foot ? '' : foot,
    }));
  };

  const handleRangeChange = (field, val) => {
    setLocalFilters((prev) => ({ ...prev, [field]: parseInt(val, 10) }));
  };

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3">
        <h2 className="font-display font-bold text-lg tracking-wider text-[#00FF87] flex items-center space-x-2">
          <FaFilter className="text-sm" />
          <span>ROSTER FILTERS</span>
        </h2>
        <button
          onClick={handleReset}
          className="text-xs text-[#555] hover:text-red-400 flex items-center space-x-1 font-semibold transition-colors uppercase"
        >
          <FaUndo className="text-[9px]" />
          <span>RESET</span>
        </button>
      </div>

      {/* Team Filter */}
      <div className="space-y-1.5">
        <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
          CLUB / TEAM
        </label>
        <input
          type="text"
          value={localFilters.team || ''}
          onChange={(e) => handleTextChange('team', e.target.value)}
          placeholder="e.g. Real Madrid, Inter Miami"
          className="w-full bg-[#1A1A1A] border border-[#222] text-white text-sm rounded-lg px-3 py-2 placeholder-[#555] focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
        />
      </div>

      {/* League Filter */}
      <div className="space-y-1.5">
        <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
          LEAGUE
        </label>
        <input
          type="text"
          value={localFilters.league || ''}
          onChange={(e) => handleTextChange('league', e.target.value)}
          placeholder="e.g. LaLiga, Premier League"
          className="w-full bg-[#1A1A1A] border border-[#222] text-white text-sm rounded-lg px-3 py-2 placeholder-[#555] focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
        />
      </div>

      {/* Nation Filter */}
      <div className="space-y-1.5">
        <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
          NATIONALITY
        </label>
        <input
          type="text"
          value={localFilters.nation || ''}
          onChange={(e) => handleTextChange('nation', e.target.value)}
          placeholder="e.g. Argentina, France"
          className="w-full bg-[#1A1A1A] border border-[#222] text-white text-sm rounded-lg px-3 py-2 placeholder-[#555] focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
        />
      </div>

      {/* Position Filter (Multi-select) */}
      <div className="space-y-2">
        <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
          POSITIONS
        </label>
        <div className="flex flex-wrap gap-1.5">
          {positionsList.map((pos) => {
            const isSelected = (localFilters.positions || []).includes(pos);
            return (
              <button
                key={pos}
                type="button"
                onClick={() => handlePositionToggle(pos)}
                className={`text-xs font-display font-bold px-2.5 py-1 rounded transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#00FF87] text-black border-[#00FF87] shadow-[0_0_8px_rgba(0,255,135,0.3)]'
                    : 'bg-[#1A1A1A] text-[#A0A0A0] border-[#222] hover:border-[#A0A0A0]/40'
                }`}
              >
                {pos}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Foot */}
      <div className="space-y-1.5">
        <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
          PREFERRED FOOT
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['Left', 'Right'].map((foot) => {
            const isSelected = localFilters.preferredFoot === foot;
            return (
              <button
                key={foot}
                type="button"
                onClick={() => handleFootChange(foot)}
                className={`text-xs font-display font-bold py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-[#00FF87]/10 text-[#00FF87] border-[#00FF87]'
                    : 'bg-[#1A1A1A] text-[#A0A0A0] border-[#222] hover:border-[#A0A0A0]/40'
                }`}
              >
                {foot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Range */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
            OVERALL RATING (OVR)
          </span>
          <span className="text-xs font-mono font-bold text-[#00FF87]">
            {localFilters.minOverall || 40} - {localFilters.maxOverall || 99}
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-[#555] w-6">MIN:</span>
            <input
              type="range"
              min="40"
              max="99"
              value={localFilters.minOverall || 40}
              onChange={(e) => handleRangeChange('minOverall', e.target.value)}
              className="w-full accent-[#00FF87] bg-[#1A1A1A] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-[#555] w-6">MAX:</span>
            <input
              type="range"
              min="40"
              max="99"
              value={localFilters.maxOverall || 99}
              onChange={(e) => handleRangeChange('maxOverall', e.target.value)}
              className="w-full accent-[#00FF87] bg-[#1A1A1A] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Age Range */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
            AGE RANGE
          </span>
          <span className="text-xs font-mono font-bold text-[#00FF87]">
            {localFilters.minAge || 16} - {localFilters.maxAge || 45}
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-[#555] w-6">MIN:</span>
            <input
              type="range"
              min="16"
              max="45"
              value={localFilters.minAge || 16}
              onChange={(e) => handleRangeChange('minAge', e.target.value)}
              className="w-full accent-[#00FF87] bg-[#1A1A1A] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-[#555] w-6">MAX:</span>
            <input
              type="range"
              min="16"
              max="45"
              value={localFilters.maxAge || 45}
              onChange={(e) => handleRangeChange('maxAge', e.target.value)}
              className="w-full accent-[#00FF87] bg-[#1A1A1A] h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Apply Action Buttons */}
      <div className="pt-4 border-t border-[#222]/50">
        <button
          onClick={handleApply}
          className="w-full bg-[#00FF87] hover:bg-[#00C96B] text-black font-display font-bold tracking-wider py-2.5 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(0,255,135,0.2)]"
        >
          APPLY FILTERS
        </button>
      </div>
    </div>
  );
}
