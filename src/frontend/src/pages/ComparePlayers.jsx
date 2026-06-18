import React, { useEffect, useState } from 'react';
import comparionBg from '../../asset/comparion-fc.png';
import { FaExchangeAlt, FaTrophy, FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import api from '../api/axios';
import CompareCard from '../components/CompareCard';
import AnalyticsChart from '../components/AnalyticsChart';

export default function ComparePlayers() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search state for Slot 1 & Slot 2
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // Load initial player from session storage if redirected from Details
  useEffect(() => {
    const slots = JSON.parse(sessionStorage.getItem('compareSlots') || '{}');
    if (slots.player1) {
      setPlayer1(slots.player1);
    }
    if (slots.player2) {
      setPlayer2(slots.player2);
    }
    // Clean slots from session storage after reading
    sessionStorage.removeItem('compareSlots');
  }, []);

  // Fetch comparison data when both slots are filled
  useEffect(() => {
    const fetchComparison = async () => {
      if (!player1 || !player2) {
        setCompareData(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const id1 = player1._id || player1.id;
        const id2 = player2._id || player2.id;
        const response = await api.get(`/compare/${id1}/${id2}`);
        setCompareData(response.data?.data);
      } catch (err) {
        console.error('Error fetching player comparison data:', err);
        setError('Failed to compute comparison analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [player1, player2]);

  // Live Search for Slot 1
  useEffect(() => {
    const searchPlayers1 = async () => {
      if (!search1.trim()) {
        setResults1([]);
        return;
      }
      setLoading1(true);
      try {
        const response = await api.get('/players/live-search', { params: { q: search1 } });
        setResults1(response.data?.data || []);
      } catch (err) {
        console.error('Slot 1 search error:', err);
      } finally {
        setLoading1(false);
      }
    };

    const handler = setTimeout(searchPlayers1, 300);
    return () => clearTimeout(handler);
  }, [search1]);

  // Live Search for Slot 2
  useEffect(() => {
    const searchPlayers2 = async () => {
      if (!search2.trim()) {
        setResults2([]);
        return;
      }
      setLoading2(true);
      try {
        const response = await api.get('/players/live-search', { params: { q: search2 } });
        setResults2(response.data?.data || []);
      } catch (err) {
        console.error('Slot 2 search error:', err);
      } finally {
        setLoading2(false);
      }
    };

    const handler = setTimeout(searchPlayers2, 300);
    return () => clearTimeout(handler);
  }, [search2]);

  const selectPlayer = (playerObj, slotNum) => {
    if (slotNum === 1) {
      setPlayer1(playerObj);
      setSearch1('');
      setResults1([]);
    } else {
      setPlayer2(playerObj);
      setSearch2('');
      setResults2([]);
    }
  };

  const clearSlot = (slotNum) => {
    if (slotNum === 1) {
      setPlayer1(null);
      setCompareData(null);
    } else {
      setPlayer2(null);
      setCompareData(null);
    }
  };

  // Format radar chart data representing overlay values
  const radarData = player1 && player2 ? [
    { subject: 'PAC', A: player1.pace || 0, B: player2.pace || 0, nameA: player1.name, nameB: player2.name },
    { subject: 'SHO', A: player1.shooting || 0, B: player2.shooting || 0, nameA: player1.name, nameB: player2.name },
    { subject: 'PAS', A: player1.passing || 0, B: player2.passing || 0, nameA: player1.name, nameB: player2.name },
    { subject: 'DRI', A: player1.dribbling || 0, B: player2.dribbling || 0, nameA: player1.name, nameB: player2.name },
    { subject: 'DEF', A: player1.defending || 0, B: player2.defending || 0, nameA: player1.name, nameB: player2.name },
    { subject: 'PHY', A: player1.physical || player1.physicality || 0, B: player2.physical || player2.physicality || 0, nameA: player1.name, nameB: player2.name },
  ] : [];

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed py-8 animate-fade-up"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 10, 0.5), rgba(10, 10, 10, 0.55)), url(${comparionBg})` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="border-b border-[#222]/50 pb-6">
          <h1 className="font-display font-extrabold text-3xl tracking-wider text-white uppercase flex items-center space-x-3">
            <FaExchangeAlt className="text-[#00FF87] text-2xl" />
            <span>STAT COMPARISON DECK</span>
          </h1>
          <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
            Select two footballers to compute attribute wins and overlay capabilities
          </p>
        </div>

        {/* Player Selection Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Selector 1 */}
          <div className="relative bg-[#111]/60 backdrop-blur-md border border-[#222]/50 rounded-xl p-4 space-y-3">
            <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              FIRST FOOTBALLER SLOT
            </label>

            {player1 ? (
              <div className="flex items-center justify-between bg-[#1A1A1A] px-4 py-2.5 rounded-lg border border-[#333]">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-bold text-[#00FF87]">{player1.overall}</span>
                  <span className="font-display font-bold text-white uppercase">{player1.name}</span>
                  <span className="text-xs text-[#555] uppercase">({player1.position})</span>
                </div>
                <button onClick={() => clearSlot(1)} className="text-[#555] hover:text-red-400">
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search first player..."
                  value={search1}
                  onChange={(e) => setSearch1(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#222] text-white text-sm rounded-lg pl-9 pr-3 py-2.5 placeholder-[#555] focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
                />
                <FaSearch className="absolute left-3 top-3.5 text-[#555] text-xs" />
                {loading1 && <FaSpinner className="absolute right-3 top-3.5 text-[#00FF87] animate-spin text-xs" />}

                {/* Dropdown results */}
                {results1.length > 0 && (
                  <div className="absolute w-full mt-1.5 bg-[#1A1A1A] border border-[#222] rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                    {results1.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => selectPlayer(p, 1)}
                        className="w-full text-left px-4 py-2 hover:bg-[#222] transition-colors text-xs text-[#A0A0A0] hover:text-white font-semibold flex items-center justify-between border-b border-[#222]/30"
                      >
                        <span>{p.name} ({p.position})</span>
                        <span className="font-mono text-[#00FF87] font-bold">{p.overall} OVR</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selector 2 */}
          <div className="relative bg-[#111]/60 backdrop-blur-md border border-[#222]/50 rounded-xl p-4 space-y-3">
            <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              SECOND FOOTBALLER SLOT
            </label>

            {player2 ? (
              <div className="flex items-center justify-between bg-[#1A1A1A] px-4 py-2.5 rounded-lg border border-[#333]">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-bold text-[#00FF87]">{player2.overall}</span>
                  <span className="font-display font-bold text-white uppercase">{player2.name}</span>
                  <span className="text-xs text-[#555] uppercase">({player2.position})</span>
                </div>
                <button onClick={() => clearSlot(2)} className="text-[#555] hover:text-red-400">
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search second player..."
                  value={search2}
                  onChange={(e) => setSearch2(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#222] text-white text-sm rounded-lg pl-9 pr-3 py-2.5 placeholder-[#555] focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
                />
                <FaSearch className="absolute left-3 top-3.5 text-[#555] text-xs" />
                {loading2 && <FaSpinner className="absolute right-3 top-3.5 text-[#00FF87] animate-spin text-xs" />}

                {/* Dropdown results */}
                {results2.length > 0 && (
                  <div className="absolute w-full mt-1.5 bg-[#1A1A1A] border border-[#222] rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                    {results2.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => selectPlayer(p, 2)}
                        className="w-full text-left px-4 py-2 hover:bg-[#222] transition-colors text-xs text-[#A0A0A0] hover:text-white font-semibold flex items-center justify-between border-b border-[#222]/30"
                      >
                        <span>{p.name} ({p.position})</span>
                        <span className="font-mono text-[#00FF87] font-bold">{p.overall} OVR</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Comparison results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#111]/30 rounded-2xl border border-[#222]/50">
            <div className="w-12 h-12 border-4 border-[#222] border-t-[#00FF87] rounded-full animate-spin mb-4"></div>
            <p className="font-display font-semibold tracking-wider text-[#A0A0A0] text-xs animate-pulse">
              CALCULATING DELTAS...
            </p>
          </div>
        ) : error ? (
          <div className="bg-[#111] border border-red-500/30 rounded-xl p-8 text-center text-red-400 font-semibold text-sm uppercase">
            {error}
          </div>
        ) : compareData ? (
          <div className="space-y-8 animate-fade-up">

            {/* Winner Banner */}
            <div className="bg-gradient-to-r from-[#111]/70 via-[#0E1B15]/75 to-[#111]/70 backdrop-blur-md border border-[#222]/50 rounded-xl p-6 text-center space-y-2">
              <div className="inline-flex items-center space-x-2 text-[#00FF87] bg-[#00FF87]/10 px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider">
                <FaTrophy className="text-xs" />
                <span>HEAD-TO-HEAD DECISION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-wide">
                {compareData.summary.overallWinner === 'Tie' ? (
                  <span>SLOT CAPABILITIES METRICS ARE TIED</span>
                ) : (
                  <span>OVERALL WINNER: <span className="text-[#00FF87]">{compareData.summary.overallWinner}</span></span>
                )}
              </h2>
              <p className="text-xs text-[#A0A0A0] font-semibold uppercase tracking-wider">
                Category wins: <span className="text-[#00FF87] font-mono">{compareData.summary.player1Wins}</span> vs <span className="text-white font-mono">{compareData.summary.player2Wins}</span> (out of {compareData.summary.totalAttributesCompared} dimensions)
              </p>
            </div>

            {/* Cards & Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <CompareCard player={player1} opponent={player2} side="left" />

              {/* Center: Overlap Radar Chart */}
              <div className="flex flex-col justify-center">
                <AnalyticsChart
                  type="radar"
                  data={radarData}
                  title="Comparison Radar Matrix"
                  description="Overlapping skill vectors (Neon Green vs White)"
                />
              </div>

              <CompareCard player={player2} opponent={player1} side="right" />
            </div>

          </div>
        ) : (
          <div className="bg-[#111]/45 backdrop-blur-md border border-dashed border-[#222]/60 rounded-2xl py-24 text-center">
            <p className="text-sm font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              COMPUTATION ENGINE IDLE
            </p>
            <p className="text-[10px] text-[#555] font-semibold uppercase mt-0.5">
              CHOOSE TWO FOOTBALLERS ABOVE TO TRIGGER DECK CALCULATIONS
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
