import React, { useEffect, useState } from 'react';
import teamBuilderBg from '../../asset/team-builder-fc.png';
import { FaFutbol, FaTrash, FaUndo, FaSearch, FaMagic, FaCloudDownloadAlt } from 'react-icons/fa';
import api from '../api/axios';

export default function TeamBuilder() {
  const [formation, setFormation] = useState('4-3-3');
  const [squad, setSquad] = useState({}); // maps slot key (e.g. 'ST') to player object
  const [chemistry, setChemistry] = useState({ totalChemistry: 0, maxPossibleChemistry: 33, summary: '0/33' });

  // Roster selector panel state
  const [activeSlot, setActiveSlot] = useState(null); // slot key being edited
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Formations coordinate registry (shifted down to prevent player face clipping)
  const formationsData = {
    '4-3-3': [
      { key: 'GK', label: 'GK', posClass: 'GK', bottom: '5%', left: '46.5%' },
      { key: 'LB', label: 'LB', posClass: 'LB', bottom: '26%', left: '10%' },
      { key: 'CB1', label: 'CB', posClass: 'CB', bottom: '20%', left: '32%' },
      { key: 'CB2', label: 'CB', posClass: 'CB', bottom: '20%', left: '60%' },
      { key: 'RB', label: 'RB', posClass: 'RB', bottom: '26%', left: '83%' },
      { key: 'CM1', label: 'CM', posClass: 'CM', bottom: '45%', left: '22%' },
      { key: 'CDM', label: 'CDM', posClass: 'CDM', bottom: '35%', left: '46.5%' },
      { key: 'CM2', label: 'CM', posClass: 'CM', bottom: '45%', left: '71%' },
      { key: 'LW', label: 'LW', posClass: 'LW', bottom: '66%', left: '15%' },
      { key: 'ST', label: 'ST', posClass: 'ST', bottom: '74%', left: '46.5%' },
      { key: 'RW', label: 'RW', posClass: 'RW', bottom: '66%', left: '78%' },
    ],
    '4-4-2': [
      { key: 'GK', label: 'GK', posClass: 'GK', bottom: '5%', left: '46.5%' },
      { key: 'LB', label: 'LB', posClass: 'LB', bottom: '26%', left: '10%' },
      { key: 'CB1', label: 'CB', posClass: 'CB', bottom: '20%', left: '32%' },
      { key: 'CB2', label: 'CB', posClass: 'CB', bottom: '20%', left: '60%' },
      { key: 'RB', label: 'RB', posClass: 'RB', bottom: '26%', left: '83%' },
      { key: 'LM', label: 'LM', posClass: 'LW', bottom: '46%', left: '10%' },
      { key: 'CM1', label: 'CM', posClass: 'CM', bottom: '42%', left: '32%' },
      { key: 'CM2', label: 'CM', posClass: 'CM', bottom: '42%', left: '60%' },
      { key: 'RM', label: 'RM', posClass: 'RW', bottom: '46%', left: '83%' },
      { key: 'ST1', label: 'ST', posClass: 'ST', bottom: '72%', left: '30%' },
      { key: 'ST2', label: 'ST', posClass: 'ST', bottom: '72%', left: '62%' },
    ],
    '3-5-2': [
      { key: 'GK', label: 'GK', posClass: 'GK', bottom: '5%', left: '46.5%' },
      { key: 'CB1', label: 'CB', posClass: 'CB', bottom: '20%', left: '20%' },
      { key: 'CB2', label: 'CB', posClass: 'CB', bottom: '20%', left: '46.5%' },
      { key: 'CB3', label: 'CB', posClass: 'CB', bottom: '20%', left: '73%' },
      { key: 'LM', label: 'LM', posClass: 'LW', bottom: '44%', left: '10%' },
      { key: 'CDM1', label: 'CDM', posClass: 'CDM', bottom: '35%', left: '30%' },
      { key: 'CDM2', label: 'CDM', posClass: 'CDM', bottom: '35%', left: '63%' },
      { key: 'RM', label: 'RM', posClass: 'RW', bottom: '44%', left: '83%' },
      { key: 'CAM', label: 'CAM', posClass: 'CAM', bottom: '54%', left: '46.5%' },
      { key: 'ST1', label: 'ST', posClass: 'ST', bottom: '73%', left: '30%' },
      { key: 'ST2', label: 'ST', posClass: 'ST', bottom: '73%', left: '63%' },
    ],
  };

  // Load saved formation and squad from localStorage on mount and check draftPlayer
  useEffect(() => {
    const savedForm = localStorage.getItem('selectedFormation');
    const savedSquad = localStorage.getItem('selectedSquad');

    let initialSquad = {};
    if (savedForm) {
      setFormation(savedForm);
    }
    if (savedSquad) {
      initialSquad = JSON.parse(savedSquad);
      setSquad(initialSquad);
    }

    const draft = localStorage.getItem('draftPlayer');
    if (draft) {
      const player = JSON.parse(draft);
      const activeFormation = savedForm || '4-3-3';
      const slots = formationsData[activeFormation];
      const match = slots.find((s) => s.posClass === player.position && !initialSquad[s.key]);
      if (match) {
        setSquad((prev) => {
          const updated = { ...prev, [match.key]: player };
          localStorage.setItem('selectedSquad', JSON.stringify(updated));
          return updated;
        });
      } else {
        const firstMatch = slots.find((s) => s.posClass === player.position);
        if (firstMatch) {
          setSquad((prev) => {
            const updated = { ...prev, [firstMatch.key]: player };
            localStorage.setItem('selectedSquad', JSON.stringify(updated));
            return updated;
          });
        }
      }
      localStorage.removeItem('draftPlayer');
    }
  }, []);

  // Save squad changes to localStorage automatically
  useEffect(() => {
    if (Object.keys(squad).length > 0) {
      localStorage.setItem('selectedSquad', JSON.stringify(squad));
    }
  }, [squad]);

  // Recalculate chemistry when squad roster updates
  useEffect(() => {
    const fetchChemistry = async () => {
      const playerIds = Object.values(squad)
        .filter(Boolean)
        .map((p) => p._id || p.id);

      if (playerIds.length === 0) {
        setChemistry({ totalChemistry: 0, maxPossibleChemistry: 0, summary: '0/0' });
        return;
      }

      try {
        const response = await api.get('/players/chemistry', {
          params: { playerIds: playerIds.join(',') },
        });
        setChemistry(response.data?.data);
      } catch (err) {
        console.error('Error calculating chemistry:', err);
      }
    };

    fetchChemistry();
  }, [squad]);

  // Query search results for selected slot position and filter duplicates
  useEffect(() => {
    const loadSlotPlayers = async () => {
      if (!activeSlot) return;
      setSearching(true);
      try {
        const slotConfig = formationsData[formation].find((s) => s.key === activeSlot);
        const positionFilter = slotConfig ? slotConfig.posClass : '';
        const response = await api.get('/players', {
          params: {
            position: positionFilter,
            q: searchQuery,
            limit: 8,
          },
        });

        // Filter out players already present in the squad to prevent reuse
        const currentSquadPlayerIds = Object.values(squad)
          .filter(Boolean)
          .map((p) => p._id || p.id);

        const filtered = (response.data?.data || []).filter(
          (p) => !currentSquadPlayerIds.includes(p._id || p.id)
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error('Error loading slot options:', err);
      } finally {
        setSearching(false);
      }
    };

    const delay = setTimeout(loadSlotPlayers, 200);
    return () => clearTimeout(delay);
  }, [activeSlot, searchQuery, formation, squad]);

  const selectPlayerForSlot = (player) => {
    setSquad((prev) => {
      const updated = { ...prev, [activeSlot]: player };
      localStorage.setItem('selectedSquad', JSON.stringify(updated));
      return updated;
    });
    setActiveSlot(null);
    setSearchQuery('');
  };

  const removePlayerFromSlot = (key, e) => {
    e.stopPropagation();
    setSquad((prev) => {
      const copy = { ...prev };
      delete copy[key];
      localStorage.setItem('selectedSquad', JSON.stringify(copy));
      return copy;
    });
  };

  const changeFormation = (newForm) => {
    setFormation(newForm);
    localStorage.setItem('selectedFormation', newForm);

    // Re-map current players to the new formation slots based on position class to prevent erasing them
    const currentPlayers = Object.values(squad).filter(Boolean);
    const newSlots = formationsData[newForm];
    const newSquad = {};
    const remainingPlayers = [...currentPlayers];

    // First pass: exact matches by position class
    newSlots.forEach((slot) => {
      const matchIdx = remainingPlayers.findIndex((p) => p.position === slot.posClass);
      if (matchIdx !== -1) {
        newSquad[slot.key] = remainingPlayers[matchIdx];
        remainingPlayers.splice(matchIdx, 1);
      }
    });

    // Second pass: fill empty slots with remaining players
    newSlots.forEach((slot) => {
      if (!newSquad[slot.key] && remainingPlayers.length > 0) {
        newSquad[slot.key] = remainingPlayers[0];
        remainingPlayers.splice(0, 1);
      }
    });

    setSquad(newSquad);
    localStorage.setItem('selectedSquad', JSON.stringify(newSquad));
  };

  const loadDreamTeam = async () => {
    setSearching(true);
    try {
      const response = await api.get('/players/dream-team');
      const { players } = response.data?.data || {};
      if (players) {
        // Reset formation to 4-3-3 as returned by the engine
        setFormation('4-3-3');

        // Map top players into corresponding slots in 4-3-3
        const newSquad = {};
        const slots = formationsData['4-3-3'];

        // Create copies of players to distribute
        let pool = [...players];
        slots.forEach((slot) => {
          const matchIndex = pool.findIndex((p) => p.position === slot.posClass);
          if (matchIndex !== -1) {
            newSquad[slot.key] = pool[matchIndex];
            pool.splice(matchIndex, 1);
          }
        });

        // Fill remaining empty slots with highest remaining players
        slots.forEach((slot) => {
          if (!newSquad[slot.key] && pool.length > 0) {
            newSquad[slot.key] = pool[0];
            pool.splice(0, 1);
          }
        });

        setSquad(newSquad);
      }
    } catch (err) {
      console.error('Failed to auto-generate dream team:', err);
    } finally {
      setSearching(false);
    }
  };

  const resetSquad = () => {
    setSquad({});
  };

  const activeSlots = formationsData[formation] || [];

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed py-8 animate-fade-up"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 10, 0.5), rgba(10, 10, 10, 0.55)), url(${teamBuilderBg})` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Title & Chemistry Indicator Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-[#222]/50 pb-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl tracking-wider text-white uppercase flex items-center space-x-3">
              <FaFutbol className="text-[#00FF87] text-2xl" />
              <span>TACTICAL SQUAD BUILDER</span>
            </h1>
            <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
              Formulate lineups, adjust layouts and inspect chemistry matches
            </p>
          </div>

          {/* Chemistry circular gauge panel */}
          <div className="bg-[#111]/60 backdrop-blur-md border border-[#222]/50 rounded-xl px-5 py-3 flex items-center space-x-6 w-full lg:w-auto">
            <div className="flex flex-col">
              <span className="text-[9px] font-display font-bold text-[#555] uppercase tracking-widest">
                CHEMISTRY RATING
              </span>
              <span className="text-2xl font-mono font-extrabold text-[#00FF87] mt-0.5">
                {chemistry.totalChemistry} <span className="text-[#555] text-sm">/ 33</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-[#222] border-t-[#00FF87] flex items-center justify-center text-[10px] font-mono font-bold text-[#00FF87] animate-pulse">
              {Math.round((chemistry.totalChemistry / 33) * 100)}%
            </div>
          </div>
        </div>

        {/* Control Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111]/65 backdrop-blur-md border border-[#222]/40 rounded-xl px-4 py-3">
          {/* Formations list */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#555] font-display font-bold uppercase tracking-wider mr-1">
              FORMATION:
            </span>
            {Object.keys(formationsData).map((form) => (
              <button
                key={form}
                onClick={() => changeFormation(form)}
                className={`text-xs font-display font-bold px-3 py-1.5 rounded transition-colors ${formation === form
                    ? 'bg-[#00FF87] text-black shadow'
                    : 'bg-[#1A1A1A] text-[#A0A0A0] border border-[#222] hover:border-[#A0A0A0]/30'
                  }`}
              >
                {form}
              </button>
            ))}
          </div>

          {/* Action button triggers */}
          <div className="flex space-x-3 w-full sm:w-auto">
            <button
              onClick={loadDreamTeam}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black font-display font-bold text-xs px-4 py-2 rounded-lg transition-all"
            >
              <FaMagic />
              <span>DREAM TEAM XI</span>
            </button>
            <button
              onClick={() => {
                resetSquad();
                localStorage.removeItem('selectedSquad');
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-transparent border border-[#FF3B3B] text-[#FF3B3B] hover:bg-red-500/10 font-display font-bold text-xs px-4 py-2 rounded-lg transition-all"
            >
              <FaUndo />
              <span>RESET SQUAD</span>
            </button>
          </div>
        </div>

        {/* Pitch Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Pitch Display (Span 2) */}
          <div className="lg:col-span-2 bg-[#0E1511]/70 backdrop-blur-sm border border-[#19271E]/60 rounded-2xl h-[620px] relative overflow-hidden shadow-inner flex flex-col justify-end p-4">

            {/* SVG Pitch Marking lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
              {/* Center Circle */}
              <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] border-2 border-white rounded-full"></div>
              {/* Midfield Line */}
              <div className="absolute top-[50%] left-0 right-0 h-0.5 bg-white"></div>
              {/* Penalty Box (Top) */}
              <div className="absolute top-0 left-[20%] w-[60%] h-[20%] border-b-2 border-x-2 border-white"></div>
              {/* Penalty Box (Bottom) */}
              <div className="absolute bottom-0 left-[20%] w-[60%] h-[20%] border-t-2 border-x-2 border-white"></div>
            </div>

            {/* Render Position Slot pins */}
            {activeSlots.map((slot) => {
              const player = squad[slot.key];

              return (
                <div
                  key={slot.key}
                  style={{
                    position: 'absolute',
                    bottom: slot.bottom,
                    left: slot.left,
                    transform: 'translate(-50%, 0)',
                  }}
                  onClick={() => setActiveSlot(slot.key)}
                  className="z-10 group cursor-pointer flex flex-col items-center select-none"
                >
                  {player ? (
                    /* Filled Slot Card */
                    <div className="w-14 sm:w-16 transition-transform hover:scale-110 relative group z-10">
                      <button
                        onClick={(e) => removePlayerFromSlot(slot.key, e)}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {player.card ? (
                        <img
                          src={player.card}
                          className="w-full h-auto object-contain select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                          alt={player.name}
                        />
                      ) : (
                        <div className="bg-[#111] border border-[#00FF87] shadow-[0_0_12px_rgba(0,255,135,0.25)] rounded-lg p-2 text-center">
                          <div className="text-[#00FF87] font-mono text-xs font-extrabold leading-none">{player.overall}</div>
                          <div className="text-[7px] font-display font-bold text-[#A0A0A0] truncate mt-1">{player.name}</div>
                          <div className="text-[6px] text-[#555] font-mono font-bold uppercase mt-0.5 leading-none">{slot.label}</div>
                        </div>
                      )}
                      {/* Tiny position badge overlay */}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#00FF87] text-black text-[7px] font-display font-extrabold px-1.5 py-0.25 rounded uppercase tracking-wider scale-90 shadow-md">
                        {slot.label}
                      </div>
                    </div>
                  ) : (
                    /* Empty Slot Indicator */
                    <div className="w-14 h-14 rounded-full bg-[#111]/80 hover:bg-[#1A1A1A] border-2 border-dashed border-[#222] hover:border-[#00FF87] flex flex-col items-center justify-center transition-all">
                      <span className="text-xs text-[#00FF87] font-display font-extrabold">+</span>
                      <span className="text-[8px] font-display font-bold text-[#555] uppercase mt-0.5">
                        {slot.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Drawer / Sidebar Search Panel (Slot selection) */}
          <div className="col-span-1">
            {activeSlot ? (
              <div className="bg-[#111]/75 backdrop-blur-md border border-[#00FF87]/30 rounded-2xl p-5 space-y-4 animate-fade-up h-full flex flex-col">

                {/* Selector Header */}
                <div className="flex justify-between items-center border-b border-[#222] pb-3">
                  <div>
                    <h3 className="text-sm font-display font-extrabold text-white uppercase tracking-wider">
                      SELECTING {activeSlot} PLAYER
                    </h3>
                    <p className="text-[10px] text-[#555] font-semibold uppercase mt-0.5">
                      Position Filter: {formationsData[formation].find((s) => s.key === activeSlot)?.posClass}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSlot(null)}
                    className="text-[#555] hover:text-white text-xs font-bold uppercase"
                  >
                    CANCEL
                  </button>
                </div>

                {/* Search bar inside sidebar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type player name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg pl-9 pr-3 py-2.5 placeholder-[#555] focus:border-[#00FF87] focus:ring-0 focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-3.5 text-[#555] text-xs" />
                </div>

                {/* Search Results list */}
                <div className="flex-grow overflow-y-auto space-y-2 max-h-[400px]">
                  {searching ? (
                    <div className="text-center py-8 text-xs text-[#555] animate-pulse">LOADING OPTIONS...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((player) => (
                      <button
                        key={player._id}
                        onClick={() => selectPlayerForSlot(player)}
                        className="w-full bg-[#1A1A1A] hover:bg-[#222] border border-[#222] hover:border-[#00FF87]/50 rounded-xl p-3 flex justify-between items-center text-left transition-all"
                      >
                        <div>
                          <div className="font-display font-bold text-xs text-white uppercase">{player.name}</div>
                          <div className="text-[9px] text-[#555] mt-0.5 uppercase tracking-wider">
                            {player.team} | {player.nation}
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#00FF87] bg-[#00FF87]/10 px-2 py-0.5 rounded">
                          {player.overall}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-[#555] uppercase font-semibold">
                      No matching positional options found.
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-[#111]/75 backdrop-blur-md border border-[#222]/50 rounded-2xl p-6 text-center space-y-4 h-full flex flex-col justify-center py-20">
                <FaFutbol className="text-4xl text-[#555] mx-auto animate-bounce" />
                <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">
                  TACTICAL PANEL IDLE
                </h3>
                <p className="text-[10px] text-[#555] font-semibold uppercase leading-relaxed max-w-xs mx-auto">
                  Click any slot pin (+) on the pitch board to search, compare and insert matching footballers.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
