import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';

export default function PlayerCard({ player, onClick }) {
  const navigate = useNavigate();

  if (!player) return null;

  const {
    _id,
    name,
    overall,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physical,
    position,
    team,
    nation,
  } = player;

  // Determine OVR color coding
  let ovrColor = 'text-[#A0A0A0] border-[#A0A0A0]/30';
  let ovrBg = 'bg-[#222]';
  if (overall >= 90) {
    ovrColor = 'text-[#FFD700] border-[#FFD700]/30';
    ovrBg = 'bg-[#FFD700]/10';
  } else if (overall >= 80) {
    ovrColor = 'text-[#00FF87] border-[#00FF87]/30';
    ovrBg = 'bg-[#00FF87]/10';
  }

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(player);
    } else {
      navigate(`/players/${_id}`);
    }
  };

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Avoid triggering details navigation
    
    // Save to sessionStorage for comparison slot
    const slots = JSON.parse(sessionStorage.getItem('compareSlots') || '{}');
    if (!slots.player1) {
      slots.player1 = player;
    } else {
      slots.player2 = player;
    }
    sessionStorage.setItem('compareSlots', JSON.stringify(slots));
    navigate('/compare');
  };

  const stats = [
    { label: 'PAC', value: pace },
    { label: 'SHO', value: shooting },
    { label: 'PAS', value: passing },
    { label: 'DRI', value: dribbling },
    { label: 'DEF', value: defending },
    { label: 'PHY', value: physical },
  ];

  return (
    <div
      onClick={handleCardClick}
      className="relative group cursor-pointer bg-[#111111] border border-[#222222] rounded-xl overflow-hidden p-5 transition-all duration-300 hover:border-[#00FF87] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,135,0.15)] flex flex-col justify-between h-72 w-full max-w-[280px] mx-auto"
    >
      {/* Top Section: Rating and Position */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-center">
          <div className={`text-3xl font-display font-extrabold px-2 py-0.5 rounded-lg border ${ovrColor} ${ovrBg} tracking-tighter`}>
            {overall}
          </div>
          <span className="font-display font-bold text-xs text-[#A0A0A0] mt-1 tracking-wider uppercase">
            OVR
          </span>
        </div>

        <div className="bg-[#1A1A1A] border border-[#222] text-[#00FF87] px-2.5 py-1 rounded-full text-xs font-display font-bold tracking-widest uppercase">
          {position}
        </div>
      </div>

      {/* Middle Section: Player Info */}
      <div className="my-4">
        <h3 className="font-display font-bold text-lg text-white truncate group-hover:text-[#00FF87] transition-colors leading-tight">
          {name}
        </h3>
        <p className="text-xs text-[#A0A0A0] font-medium truncate mt-0.5 uppercase tracking-wide">
          {team}
        </p>
        <p className="text-[10px] text-[#555555] font-semibold truncate uppercase tracking-widest">
          {nation}
        </p>
      </div>

      {/* Bottom Section: Key Stats Row */}
      <div className="grid grid-cols-6 gap-1 border-t border-[#222]/50 pt-3 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-[9px] text-[#555555] font-bold font-mono tracking-tighter">
              {stat.label}
            </span>
            <span className="text-xs font-mono font-bold text-white mt-0.5">
              {stat.value || '--'}
            </span>
          </div>
        ))}
      </div>

      {/* Hover Action Overlay Overlay Buttons */}
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl">
        <button
          onClick={handleCardClick}
          className="flex items-center space-x-1 bg-[#1A1A1A] border border-[#222] hover:border-[#00FF87] text-white hover:text-[#00FF87] px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
        >
          <FaInfoCircle />
          <span>STATS</span>
        </button>
        <button
          onClick={handleCompareClick}
          className="flex items-center space-x-1 bg-[#00FF87] hover:bg-[#00C96B] text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,255,135,0.3)]"
        >
          <FaExchangeAlt />
          <span>COMPARE</span>
        </button>
      </div>
    </div>
  );
}
