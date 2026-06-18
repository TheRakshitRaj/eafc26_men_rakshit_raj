import React from 'react';

export default function CompareCard({ player, opponent, side = 'left' }) {
  if (!player) {
    return (
      <div className="bg-[#111] border border-dashed border-[#222] rounded-xl p-8 flex flex-col items-center justify-center text-center h-[500px]">
        <div className="w-12 h-12 rounded-full border border-dashed border-[#333] flex items-center justify-center text-[#555] mb-3 text-lg font-bold">
          +
        </div>
        <p className="font-display font-bold text-[#A0A0A0] text-sm uppercase tracking-wider">
          SELECT A PLAYER
        </p>
        <p className="text-[10px] text-[#555] font-semibold uppercase mt-0.5">
          TO COMPARE HEAD-TO-HEAD
        </p>
      </div>
    );
  }

  const {
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
    weakFoot,
    skillMoves,
  } = player;

  const compareStat = (value, oppValue) => {
    if (!oppValue) return 'text-white';
    if (value > oppValue) return 'text-[#00FF87] font-extrabold';
    if (value < oppValue) return 'text-red-500';
    return 'text-white';
  };

  const getStatPercent = (val) => `${(val / 99) * 100}%`;

  const items = [
    { label: 'OVERALL RATING', val: overall, oppVal: opponent?.overall },
    { label: 'PAC (PACE)', val: pace, oppVal: opponent?.pace },
    { label: 'SHO (SHOOTING)', val: shooting, oppVal: opponent?.shooting },
    { label: 'PAS (PASSING)', val: passing, oppVal: opponent?.passing },
    { label: 'DRI (DRIBBLING)', val: dribbling, oppVal: opponent?.dribbling },
    { label: 'DEF (DEFENDING)', val: defending, oppVal: opponent?.defending },
    { label: 'PHY (PHYSICALITY)', val: physical, oppVal: opponent?.physical },
    { label: 'AGE', val: age, oppVal: opponent?.age, invert: true }, // Lower age is better in career mode
    { label: 'WEAK FOOT', val: weakFoot, oppVal: opponent?.weakFoot },
    { label: 'SKILL MOVES', val: skillMoves, oppVal: opponent?.skillMoves },
  ];

  const isLeft = side === 'left';

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 flex flex-col h-full transition-all duration-300">
      
      {/* Player Header */}
      <div className={`flex items-center space-x-4 border-b border-[#222]/50 pb-5 ${isLeft ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Large OVR */}
        <div className="text-center">
          <div className="text-4xl font-display font-extrabold text-[#00FF87] tracking-tighter">
            {overall}
          </div>
          <div className="bg-[#1A1A1A] border border-[#222] text-[#A0A0A0] text-[9px] font-display font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mt-1">
            {position}
          </div>
        </div>

        {/* Name / Info */}
        <div className={`flex-grow ${isLeft ? 'text-left' : 'text-right'}`}>
          <h2 className="font-display font-bold text-xl text-white truncate uppercase tracking-wide">
            {name}
          </h2>
          <p className="text-xs text-[#00FF87] font-semibold uppercase tracking-wider mt-0.5">
            {team}
          </p>
          <p className="text-[10px] text-[#A0A0A0] font-semibold uppercase tracking-widest">
            {nation}
          </p>
        </div>
      </div>

      {/* Attributes Comparison */}
      <div className="space-y-4 mt-6 flex-grow">
        {items.map((item, idx) => {
          let compareClass = compareStat(item.val, item.oppVal);
          // If inverting (e.g. age: lower is better)
          if (item.invert && item.oppVal) {
            compareClass = compareStat(item.oppVal, item.val);
          }

          const barColor = item.val >= 80 ? 'bg-[#00FF87]' : item.val >= 70 ? 'bg-[#00D8FF]' : 'bg-[#555]';

          return (
            <div key={idx} className="space-y-1.5">
              {/* Stat Name & Value */}
              <div className={`flex justify-between items-center text-xs ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
                  {item.label}
                </span>
                <span className={`font-mono text-sm ${compareClass}`}>
                  {item.val}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2 w-full bg-[#1A1A1A] rounded-full overflow-hidden border border-[#222]">
                <div
                  style={{
                    width: getStatPercent(item.label.includes('AGE') ? (item.val / 50) * 99 : item.val),
                    float: isLeft ? 'left' : 'right',
                  }}
                  className={`h-full ${barColor} transition-all duration-500`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Details */}
      <div className="border-t border-[#222]/50 pt-5 mt-6 grid grid-cols-2 gap-4 text-xs font-semibold">
        <div className={isLeft ? 'text-left' : 'text-right'}>
          <span className="text-[#555] block uppercase text-[9px] font-bold">Preferred Foot</span>
          <span className="text-white text-sm font-display font-bold uppercase">{preferredFoot || 'Right'}</span>
        </div>
        <div className={isLeft ? 'text-right' : 'text-left'}>
          <span className="text-[#555] block uppercase text-[9px] font-bold">Weak Foot Stars</span>
          <span className="text-white text-sm font-mono font-bold">{'★'.repeat(weakFoot || 3)}</span>
        </div>
      </div>

    </div>
  );
}
