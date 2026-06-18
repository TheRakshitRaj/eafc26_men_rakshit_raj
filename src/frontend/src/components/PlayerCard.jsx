import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExchangeAlt, FaInfoCircle, FaRegStar, FaStar } from 'react-icons/fa';

export default function PlayerCard({ player, onClick }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
    age,
    preferredFoot,
  } = player;

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(player);
    } else {
      navigate(`/players/${_id}`);
    }
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    const slots = JSON.parse(sessionStorage.getItem('compareSlots') || '{}');
    if (!slots.player1) {
      slots.player1 = player;
    } else {
      slots.player2 = player;
    }
    sessionStorage.setItem('compareSlots', JSON.stringify(slots));
    navigate('/compare');
  };

  const getPlayerHeight = (pos) => {
    const p = (pos || '').toUpperCase();
    if (p === 'GK') return '193cm';
    if (['CB', 'RCB', 'LCB'].includes(p)) return '189cm';
    if (['ST', 'CF'].includes(p)) return '186cm';
    if (['CM', 'CDM', 'CAM'].includes(p)) return '182cm';
    if (['LB', 'RB', 'LWB', 'RWB'].includes(p)) return '178cm';
    return '176cm';
  };

  const getPlayerWorkRate = (pos) => {
    const p = (pos || '').toUpperCase();
    if (p === 'GK') return 'Med/Med';
    if (['CB', 'CDM'].includes(p)) return 'Med/High';
    if (['LB', 'RB', 'LWB', 'RWB'].includes(p)) return 'High/Med';
    if (['CM', 'CAM'].includes(p)) return 'High/High';
    return 'High/Med';
  };

  const formatNameParts = (fullName) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return { first: '', last: parts[0] };
    }
    const last = parts.pop();
    const first = parts.join(' ');
    return { first, last };
  };

  const { first, last } = formatNameParts(name);

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
      className="relative group cursor-pointer bg-[#0A0D0B]/90 backdrop-blur-md border border-[#00FF87]/20 shadow-[0_0_15px_rgba(0,255,135,0.08)] hover:border-[#00FF87] hover:shadow-[0_0_25px_rgba(0,255,135,0.3)] rounded-2xl overflow-hidden p-4 pb-5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between w-full max-w-[290px] mx-auto min-h-[460px]"
    >
      {/* 1. FUT Card Shield image area */}
      <div className="w-full flex justify-center items-center mb-3">
        {!imgError && player.card ? (
          <img
            src={player.card}
            onError={() => setImgError(true)}
            className="w-[210px] h-auto object-contain select-none transition-transform duration-300 group-hover:scale-105"
            alt={name}
          />
        ) : (
          /* CSS-based fallback card */
          <div className="w-[210px] aspect-[440/548] relative bg-gradient-to-b from-[#121E17] via-[#0A0F0C] to-[#050706] border border-[#00FF87]/30 rounded-xl overflow-hidden flex flex-col justify-between p-4 shadow-inner select-none transition-transform duration-300 group-hover:scale-105">
            <div className="flex justify-between items-start">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-display font-black text-[#00FF87] leading-none tracking-tighter">{overall}</span>
                <span className="text-[9px] font-display font-bold text-[#A0A0A0] mt-1">{position}</span>
              </div>
              <div className="text-right text-[8px] text-[#A0A0A0] font-bold">
                <div className="truncate max-w-[70px]">{team}</div>
                <div className="text-[#555] truncate max-w-[70px] mt-0.5">{nation}</div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-white"></div>
            </div>

            <div className="z-10 text-center border-t border-[#222]/30 pt-2">
              <span className="font-display font-extrabold text-[11px] uppercase text-white tracking-wider truncate block">{name}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Player Name block */}
      <div className="px-1 flex justify-between items-center">
        <div>
          <h3 className="font-display font-extrabold text-base text-white tracking-wide uppercase leading-tight truncate max-w-[210px]">
            {last}
          </h3>
          <div className="text-[10px] text-[#A0A0A0] font-semibold uppercase mt-0.5">
            {first} <span className="text-[#00FF87]">{last}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="text-gray-500 hover:text-yellow-400 p-1.5 transition-colors"
        >
          {isFavorite ? <FaStar className="text-yellow-400 text-sm" /> : <FaRegStar className="text-sm" />}
        </button>
      </div>

      {/* 3. Base Stats Attributes row */}
      <div className="grid grid-cols-6 gap-0.5 border-t border-[#222]/30 pt-3 text-center mt-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-[9px] text-[#555555] font-bold font-mono tracking-tighter">
              {stat.label}
            </span>
            <span className="text-xs font-mono font-extrabold text-[#00FF87] mt-0.5">
              {stat.value || '--'}
            </span>
          </div>
        ))}
      </div>

      {/* 4. Player Bio details row */}
      <div className="border-t border-[#222]/30 pt-3 grid grid-cols-4 gap-1 text-[10px] text-center text-[#A0A0A0] font-semibold mt-3 bg-[#111]/30 py-1.5 rounded-lg">
        <div>
          <span className="text-[#555] block text-[8px] font-bold">AGE</span>
          <span className="text-white font-mono">{age}</span>
        </div>
        <div className="border-l border-[#222]/30">
          <span className="text-[#555] block text-[8px] font-bold">HEIGHT</span>
          <span className="text-white font-mono">{getPlayerHeight(position)}</span>
        </div>
        <div className="border-l border-[#222]/30">
          <span className="text-[#555] block text-[8px] font-bold">FOOT</span>
          <span className="text-white uppercase">{preferredFoot || 'Right'}</span>
        </div>
        <div className="border-l border-[#222]/30">
          <span className="text-[#555] block text-[8px] font-bold">WORK RATE</span>
          <span className="text-white text-[8px] uppercase leading-none block mt-0.5">{getPlayerWorkRate(position)}</span>
        </div>
      </div>

      {/* 5. View Details / Action button */}
      <button
        onClick={handleCardClick}
        className="w-full mt-4 bg-transparent border border-[#00FF87]/30 hover:border-[#00FF87] text-[#00FF87] hover:bg-[#00FF87]/5 font-display font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center space-x-2"
      >
        <span>VIEW DETAILS</span>
        <span className="w-4.5 h-4.5 rounded-full bg-[#00FF87]/10 flex items-center justify-center text-[9px] font-mono group-hover:bg-[#00FF87] group-hover:text-black transition-all">→</span>
      </button>

      {/* Hover Action Overlay Overlay Buttons (Shown on small absolute badge in corner) */}
      <div className="absolute top-2 left-2 flex flex-col space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <button
          onClick={handleCompareClick}
          className="bg-black/80 border border-[#222] hover:border-[#00FF87] text-white hover:text-[#00FF87] p-2 rounded-full text-xs font-bold transition-all shadow-md"
          title="Compare Head-to-Head"
        >
          <FaExchangeAlt />
        </button>
      </div>
    </div>
  );
}
