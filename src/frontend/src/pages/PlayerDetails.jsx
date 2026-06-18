import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaExchangeAlt, FaGamepad, FaInfoCircle, FaChevronDown, FaChevronUp, FaRunning, FaCrosshairs, FaSlidersH, FaShieldAlt } from 'react-icons/fa';
import api from '../api/axios';
import AnalyticsChart from '../components/AnalyticsChart';
import PlayerCard from '../components/PlayerCard';

export default function PlayerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accordion toggle states
  const [expandedSections, setExpandedSections] = useState({
    pace: true,
    shooting: true,
    passing: false,
    dribbling: false,
    defending: false,
    physical: false,
  });

  useEffect(() => {
    const fetchPlayerAndRecs = async () => {
      setLoading(true);
      setError(null);
      try {
        const playerRes = await api.get(`/players/${id}`);
        const pData = playerRes.data?.data;
        setPlayer(pData);

        if (pData) {
          // Fetch recommendations based on position and rating
          const recRes = await api.get('/players/recommendations', {
            params: { position: pData.position, overall: pData.overall },
          });
          // Filter out the current player from recommendations
          const filteredRecs = (recRes.data?.data || []).filter((r) => r._id !== pData._id);
          setRecommendations(filteredRecs.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching player details:', err);
        setError('Failed to retrieve player profile. Please verify player ID.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerAndRecs();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#0A0A0A] text-white">
        <div className="w-12 h-12 border-4 border-[#222] border-t-[#00FF87] rounded-full animate-spin mb-4"></div>
        <p className="font-display font-semibold tracking-wider text-[#A0A0A0] text-sm animate-pulse">
          DECRYPTING PLAYER STATS DATABASE...
        </p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-up">
        <div className="text-red-500 text-5xl font-display font-extrabold uppercase">
          404 - PLAYER MISSING
        </div>
        <p className="text-[#A0A0A0] text-sm uppercase tracking-wider font-semibold">
          {error || 'This player document could not be matched with our database indexes.'}
        </p>
        <Link
          to="/players"
          className="inline-block bg-[#00FF87] hover:bg-[#00C96B] text-black font-display font-bold tracking-wider px-6 py-2.5 rounded-lg transition-all"
        >
          BACK TO ROSTER
        </Link>
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
    league,
    nation,
    age,
    weakFoot,
    skillMoves,
    preferredFoot,
    playstyles = [],
  } = player;

  // Derive sub-attributes realistically from main stats for visual depth
  const subAttributes = {
    pace: [
      { name: 'Acceleration', val: Math.min(99, Math.max(1, pace - 2)) },
      { name: 'Sprint Speed', val: Math.min(99, Math.max(1, pace + 2)) },
    ],
    shooting: [
      { name: 'Positioning', val: Math.min(99, Math.max(1, shooting + 1)) },
      { name: 'Finishing', val: Math.min(99, Math.max(1, shooting - 2)) },
      { name: 'Shot Power', val: Math.min(99, Math.max(1, shooting + 4)) },
      { name: 'Long Shots', val: Math.min(99, Math.max(1, shooting - 1)) },
      { name: 'Penalties', val: Math.min(99, Math.max(1, shooting - 3)) },
    ],
    passing: [
      { name: 'Vision', val: Math.min(99, Math.max(1, passing + 2)) },
      { name: 'Crossing', val: Math.min(99, Math.max(1, passing - 3)) },
      { name: 'Short Passing', val: Math.min(99, Math.max(1, passing + 3)) },
      { name: 'Long Passing', val: Math.min(99, Math.max(1, passing - 1)) },
      { name: 'Curve', val: Math.min(99, Math.max(1, passing + 1)) },
    ],
    dribbling: [
      { name: 'Agility', val: Math.min(99, Math.max(1, dribbling + 3)) },
      { name: 'Balance', val: Math.min(99, Math.max(1, dribbling - 2)) },
      { name: 'Reactions', val: Math.min(99, Math.max(1, dribbling + 2)) },
      { name: 'Ball Control', val: Math.min(99, Math.max(1, dribbling + 1)) },
      { name: 'Composure', val: Math.min(99, Math.max(1, dribbling - 1)) },
    ],
    defending: [
      { name: 'Interceptions', val: Math.min(99, Math.max(1, defending + 2)) },
      { name: 'Heading Accuracy', val: Math.min(99, Math.max(1, defending - 4)) },
      { name: 'Defensive Awareness', val: Math.min(99, Math.max(1, defending + 1)) },
      { name: 'Standing Tackle', val: Math.min(99, Math.max(1, defending + 3)) },
      { name: 'Sliding Tackle', val: Math.min(99, Math.max(1, defending - 1)) },
    ],
    physical: [
      { name: 'Jumping', val: Math.min(99, Math.max(1, physical - 2)) },
      { name: 'Stamina', val: Math.min(99, Math.max(1, physical + 3)) },
      { name: 'Strength', val: Math.min(99, Math.max(1, physical + 1)) },
      { name: 'Aggression', val: Math.min(99, Math.max(1, physical - 1)) },
    ],
  };

  // Radar Chart Data formatting
  const radarData = [
    { subject: 'PAC', A: pace, nameA: name },
    { subject: 'SHO', A: shooting, nameA: name },
    { subject: 'PAS', A: passing, nameA: name },
    { subject: 'DRI', A: dribbling, nameA: name },
    { subject: 'DEF', A: defending, nameA: name },
    { subject: 'PHY', A: physical, nameA: name },
  ];

  // Mocked performance data (simulated 5-match rating form)
  const performanceData = [
    { name: 'Match 1', value: Math.min(99, Math.max(40, overall - 4)) },
    { name: 'Match 2', value: Math.min(99, Math.max(40, overall + 2)) },
    { name: 'Match 3', value: Math.min(99, Math.max(40, overall - 1)) },
    { name: 'Match 4', value: Math.min(99, Math.max(40, overall + 3)) },
    { name: 'Match 5', value: Math.min(99, Math.max(40, overall)) },
  ];

  const toggleSection = (sect) => {
    setExpandedSections((prev) => ({ ...prev, [sect]: !prev[sect] }));
  };

  const handleCompareClick = () => {
    const slots = JSON.parse(sessionStorage.getItem('compareSlots') || '{}');
    slots.player1 = player;
    sessionStorage.setItem('compareSlots', JSON.stringify(slots));
    navigate('/compare');
  };

  const handleTeamBuilderClick = () => {
    // Save selected player to draft slot in local storage for TeamBuilder page
    localStorage.setItem('draftPlayer', JSON.stringify(player));
    navigate('/team-builder');
  };

  const getBarColor = (val) => {
    if (val >= 85) return 'bg-yellow-400';
    if (val >= 80) return 'bg-[#00FF87]';
    if (val >= 70) return 'bg-[#00D8FF]';
    return 'bg-[#555]';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-up">
      {/* 1. Header Panel */}
      <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-[#00FF87]/5 filter blur-3xl pointer-events-none"></div>

        <div className="flex items-center space-x-6">
          {/* Large OVR Circle Badge */}
          <div className="flex flex-col items-center">
            <div className="text-5xl sm:text-6xl font-display font-extrabold text-[#00FF87] bg-[#00FF87]/5 border-2 border-[#00FF87]/30 rounded-2xl px-4 py-2 shadow-[0_0_20px_rgba(0,255,135,0.2)] tracking-tighter">
              {overall}
            </div>
            <span className="text-[10px] font-display font-bold text-[#A0A0A0] uppercase tracking-widest mt-1">
              {position}
            </span>
          </div>

          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-wide uppercase leading-none">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm font-semibold text-[#A0A0A0]">
              <span className="text-[#00FF87] uppercase">{team}</span>
              <span className="text-[#555]">•</span>
              <span className="uppercase">{league}</span>
              <span className="text-[#555]">•</span>
              <span className="uppercase tracking-widest text-[#555]">{nation}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={handleCompareClick}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-2 bg-transparent border border-[#00FF87] text-[#00FF87] hover:bg-[#00FF87]/10 px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all tracking-wider"
          >
            <FaExchangeAlt />
            <span>COMPARE STATS</span>
          </button>
          <button
            onClick={handleTeamBuilderClick}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-2 bg-[#00FF87] hover:bg-[#00C96B] text-black px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all tracking-wider shadow-[0_0_15px_rgba(0,255,135,0.25)]"
          >
            <FaGamepad />
            <span>ADD TO SQUAD</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Grid & Radar Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stats Blocks (Left column - span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-display font-extrabold text-xl tracking-wider uppercase border-b border-[#222]/50 pb-3 text-white flex items-center space-x-2">
            <FaSlidersH className="text-[#00FF87] text-sm" />
            <span>CORE ATTRIBUTES</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'PAC (PACE)', val: pace },
              { label: 'SHO (SHOOTING)', val: shooting },
              { label: 'PAS (PASSING)', val: passing },
              { label: 'DRI (DRIBBLING)', val: dribbling },
              { label: 'DEF (DEFENDING)', val: defending },
              { label: 'PHY (PHYSICAL)', val: physical },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col justify-between h-24 hover:border-[#00FF87] transition-colors"
              >
                <span className="text-[10px] font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-3xl font-mono font-extrabold text-white">
                    {stat.val || '--'}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.val >= 80 ? '#00FF87' : stat.val >= 70 ? '#00D8FF' : '#555' }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Demographic Bio Card */}
          <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <div>
              <span className="text-[#555] block uppercase text-[9px] font-bold">AGE</span>
              <span className="text-white text-sm font-mono">{age} Years</span>
            </div>
            <div>
              <span className="text-[#555] block uppercase text-[9px] font-bold">PREFERRED FOOT</span>
              <span className="text-white text-sm uppercase">{preferredFoot || 'Right'}</span>
            </div>
            <div>
              <span className="text-[#555] block uppercase text-[9px] font-bold">WEAK FOOT</span>
              <span className="text-white text-sm font-mono">{'★'.repeat(weakFoot || 3)}</span>
            </div>
            <div>
              <span className="text-[#555] block uppercase text-[9px] font-bold">SKILL MOVES</span>
              <span className="text-white text-sm font-mono">{'★'.repeat(skillMoves || 3)}</span>
            </div>
          </div>
        </div>

        {/* Radar Chart (Right Column) */}
        <div className="col-span-1">
          <AnalyticsChart
            type="radar"
            data={radarData}
            title="Attribute Spider Matrix"
            description="Overview of main play categories"
          />
        </div>
      </div>

      {/* 3. Detailed Accordion & Playstyles & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Accordions (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-extrabold text-xl tracking-wider uppercase border-b border-[#222]/50 pb-3 text-white flex items-center space-x-2">
            <FaRunning className="text-[#00FF87] text-sm" />
            <span>DETAILED ATTRIBUTE MATRIX</span>
          </h2>

          <div className="space-y-3">
            {Object.keys(subAttributes).map((sect) => {
              const isOpen = expandedSections[sect];
              const mainVal = player[sect] || player.physical; // Fallback mapping for physical field

              return (
                <div key={sect} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(sect)}
                    className="w-full flex justify-between items-center px-5 py-4 bg-[#161616]/40 hover:bg-[#161616] text-sm font-display font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/20 px-2 py-0.5 rounded">
                        {mainVal}
                      </span>
                      <span className="tracking-wide">{sect} STATS</span>
                    </div>
                    {isOpen ? <FaChevronUp className="text-xs text-[#555]" /> : <FaChevronDown className="text-xs text-[#555]" />}
                  </button>

                  {isOpen && (
                    <div className="p-5 space-y-4 border-t border-[#222]/30 animate-fade-up">
                      {subAttributes[sect].map((sub, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[#A0A0A0] font-medium">{sub.name}</span>
                            <span className="font-mono font-bold text-white">{sub.val}</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#1A1A1A] border border-[#222] rounded-full overflow-hidden">
                            <div
                              style={{ width: `${(sub.val / 99) * 100}%` }}
                              className={`h-full ${getBarColor(sub.val)}`}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Playstyles & Performance History */}
        <div className="space-y-8">
          
          {/* Playstyles Card */}
          <div className="bg-[#111] border border-[#222] rounded-xl p-5 space-y-4">
            <h3 className="font-display font-bold text-sm tracking-wider uppercase text-[#00FF87]">
              PLAYSTYLES & BADGES
            </h3>
            {playstyles.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {playstyles.map((ps, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-display font-bold px-3 py-1.5 rounded-lg bg-[#1A1A1A] border border-[#222] text-white tracking-widest uppercase hover:border-[#00FF87] transition-colors"
                  >
                    {ps}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#555] font-semibold uppercase italic">
                No custom playstyles seeded on this profile.
              </p>
            )}
          </div>

          {/* Performance Chart */}
          <AnalyticsChart
            type="line"
            data={performanceData}
            title="Form Trajectory (Simulated)"
            description="Overall Rating performance index in last 5 matches"
          />

        </div>
      </div>

      {/* 4. Recommendation Cards (Recommendations / Comparison) */}
      <section className="space-y-6 pt-6 border-t border-[#222]/50">
        <div>
          <h2 className="font-display font-extrabold text-xl tracking-wider uppercase text-white">
            RECOMMENDED ALTERNATIVES
          </h2>
          <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
            SIMILAR ALTERNATIVE PROFILES FOR MATCHING POSITION ({position}) AND RATING ({overall}±3)
          </p>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((player) => (
              <PlayerCard key={player._id} player={player} />
            ))}
          </div>
        ) : (
          <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center text-[#A0A0A0] text-sm uppercase">
            No alternatives found in database indexes.
          </div>
        )}
      </section>
    </div>
  );
}
