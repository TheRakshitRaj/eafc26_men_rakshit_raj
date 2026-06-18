import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaExchangeAlt, FaGamepad, FaChartBar, FaUsers, FaGlobe, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import PlayerCard from '../components/PlayerCard';
import AnalyticsChart from '../components/AnalyticsChart';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [stats, setStats] = useState({
    players: 0,
    avgRating: 0,
    teams: 0,
    leagues: 0,
  });

  // Chart preview data state
  const [nationData, setNationData] = useState([]);
  const [positionData, setPositionData] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Run stats queries in parallel
        const [
          countRes,
          ratingRes,
          teamsRes,
          leaguesRes,
          topRatedRes,
          trendingRes,
          nationsRes,
          positionsRes,
        ] = await Promise.all([
          api.get('/stats/players/count').catch(() => ({ data: { data: 16 } })),
          api.get('/stats/players/average-rating').catch(() => ({ data: { data: 85 } })),
          api.get('/stats/players/team-count').catch(() => ({ data: { data: 8 } })),
          api.get('/stats/players/league-count').catch(() => ({ data: { data: 5 } })),
          api.get('/players/top-rated?limit=4').catch(() => ({ data: { data: [] } })),
          api.get('/players/trending').catch(() => ({ data: { data: [] } })),
          api.get('/analytics/top-nations').catch(() => ({ data: { data: [] } })),
          api.get('/analytics/position-distribution').catch(() => ({ data: { data: [] } })),
        ]);

        setStats({
          players: countRes.data?.data?.count || 0,
          avgRating: Math.round(ratingRes.data?.data?.averageRating || 0),
          teams: teamsRes.data?.data?.teamCount || 0,
          leagues: leaguesRes.data?.data?.leagueCount || 0,
        });

        setTopRated(topRatedRes.data?.data || []);
        setTrending(trendingRes.data?.data || []);

        // Prepare Top Nations chart data
        if (nationsRes.data?.data) {
          const formattedNations = nationsRes.data.data.slice(0, 5).map((item) => ({
            name: item._id || 'Unknown',
            value: item.count || item.averageOverall || 0,
          }));
          setNationData(formattedNations);
        }

        // Prepare Position Distribution chart data
        if (positionsRes.data?.data) {
          const formattedPositions = positionsRes.data.data.slice(0, 6).map((item) => ({
            name: item._id || 'N/A',
            value: item.count || 0,
          }));
          setPositionData(formattedPositions);
        }
      } catch (err) {
        console.error('Error fetching dashboard landing stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/players?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="space-y-16 pb-16 animate-fade-up">
      {/* 1. Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col justify-center items-center px-4 bg-gradient-to-b from-[#0A0A0A] via-[#0D1510] to-[#0A0A0A] overflow-hidden border-b border-[#222]/30">
        {/* Animated Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,135,0.08),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>

        <div className="max-w-4xl text-center space-y-6 z-10">
          <div className="inline-flex items-center space-x-2 bg-[#00FF87]/10 border border-[#00FF87]/30 text-[#00FF87] px-3.5 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider animate-pulse-slow">
            <FaTrophy className="text-xs" />
            <span>EA SPORTS FC 26 DATA HUB</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-none text-white tracking-tighter uppercase">
            THE ULTIMATE <span className="text-[#00FF87] bg-clip-text">FC 26</span> INTELLIGENCE PLATFORM
          </h1>

          <p className="text-sm sm:text-base text-[#A0A0A0] max-w-2xl mx-auto font-body font-medium leading-relaxed">
            Analyze world-class soccer stars, build optimal tactical chemistry squads, compare player metrics side-by-side, and explore live aggregations from our MongoDB football index database.
          </p>

          {/* Centered Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <SearchBar onSearch={handleSearch} placeholder="Explore players by name, country, position..." />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/players"
              className="bg-[#00FF87] hover:bg-[#00C96B] text-black font-display font-bold tracking-wider px-6 py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,255,135,0.3)] hover:shadow-[0_0_30px_rgba(0,255,135,0.55)]"
            >
              EXPLORE PLAYERS
            </Link>
            <Link
              to="/analytics"
              className="border border-[#00FF87] text-[#00FF87] hover:bg-[#00FF87]/10 font-display font-bold tracking-wider px-6 py-3 rounded-xl transition-all duration-200"
            >
              VIEW ANALYTICS
            </Link>
          </div>
        </div>

        {/* Live Stat Counters Row */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 mt-16 z-10 w-full px-6 text-center border-t border-[#222]/30 pt-10">
          <div>
            <div className="text-3xl md:text-5xl font-mono font-extrabold text-[#00FF87]">
              {stats.players}
            </div>
            <div className="text-[10px] md:text-xs font-display font-bold text-[#555] uppercase mt-1.5 tracking-wider">
              TOTAL INDEXED PLAYERS
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-mono font-extrabold text-white">
              {stats.avgRating}
            </div>
            <div className="text-[10px] md:text-xs font-display font-bold text-[#555] uppercase mt-1.5 tracking-wider">
              AVG ROSTER RATING
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-mono font-extrabold text-[#00FF87]">
              {stats.teams}
            </div>
            <div className="text-[10px] md:text-xs font-display font-bold text-[#555] uppercase mt-1.5 tracking-wider">
              TEAMS REPRESENTED
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-mono font-extrabold text-white">
              {stats.leagues}
            </div>
            <div className="text-[10px] md:text-xs font-display font-bold text-[#555] uppercase mt-1.5 tracking-wider">
              LEAGUES COVERED
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Rated Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#222] pb-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl tracking-wider text-white uppercase">
              TOP RATED ROSTER
            </h2>
            <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
              HIGHEST OVERALL SCORING FOOTBALLERS IN THE PLATFORM
            </p>
          </div>
          <Link
            to="/players"
            className="text-xs text-[#00FF87] hover:text-[#00C96B] font-display font-bold tracking-widest uppercase transition-colors"
          >
            VIEW ALL ROSTER →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-[#111] border border-[#222] rounded-xl h-72 animate-pulse"></div>
            ))}
          </div>
        ) : topRated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRated.map((player) => (
              <PlayerCard key={player._id} player={player} />
            ))}
          </div>
        ) : (
          <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center text-[#A0A0A0] text-sm uppercase">
            No top rated players found. Run seed file on backend.
          </div>
        )}
      </section>

      {/* 3. Trending Players Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#222] pb-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl tracking-wider text-white uppercase flex items-center space-x-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00FF87] animate-ping mr-1"></span>
              <span>TRENDING PLAYERS</span>
            </h2>
            <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
              COMMUNITY FAVORITES AND HOT SEARCH PROFILES
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-[#111] border border-[#222] rounded-xl h-72 animate-pulse"></div>
            ))}
          </div>
        ) : trending.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.slice(0, 4).map((player) => (
              <div key={player._id} className="relative">
                <PlayerCard player={player} />
                <span className="absolute top-3 right-3 bg-[#00FF87] text-black text-[9px] font-display font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow z-10 select-none">
                  TRENDING
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111] border border-[#222] rounded-xl p-8 text-center text-[#A0A0A0] text-sm uppercase">
            No trending players found at this moment.
          </div>
        )}
      </section>

      {/* 4. Analytics Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#111]/40 border border-[#222]/50 rounded-2xl p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#222]/30 pb-4 gap-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl tracking-wider text-white uppercase">
              DATA VISUALIZATION PREVIEW
            </h2>
            <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
              COMPACT DEMOGRAPHIC STATS INTEGRATED FROM DATABASE METRICS
            </p>
          </div>
          <Link
            to="/analytics"
            className="bg-[#1A1A1A] border border-[#333] hover:border-[#00FF87] hover:text-[#00FF87] text-[#A0A0A0] font-display font-bold tracking-widest text-xs px-4 py-2.5 rounded-lg transition-all"
          >
            EXPLORE FULL ANALYTICS →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalyticsChart
            type="pie"
            data={nationData}
            title="Top Nationalities represented"
            description="Player count per nation"
          />
          <AnalyticsChart
            type="bar"
            data={positionData}
            title="Position Roster distribution"
            description="Player count grouped by pitch configuration"
          />
        </div>
      </section>

      {/* 5. Quick Navigation Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-[#222] pb-4">
          <h2 className="font-display font-extrabold text-2xl tracking-wider text-white uppercase">
            PLATFORM MODULES
          </h2>
          <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
            DEDICATED POWER UTILITIES TO OPTIMIZE SQUAD MANAGEMENT
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Roster */}
          <Link
            to="/players"
            className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col justify-between h-48 transition-all hover:border-[#00FF87] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,135,0.15)]"
          >
            <FaUsers className="text-3xl text-[#00FF87]" />
            <div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide">
                Player Index
              </h3>
              <p className="text-xs text-[#555] font-semibold mt-1">
                Filter and inspect the global player catalog.
              </p>
            </div>
          </Link>

          {/* Card 2: Compare */}
          <Link
            to="/compare"
            className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col justify-between h-48 transition-all hover:border-[#00FF87] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,135,0.15)]"
          >
            <FaExchangeAlt className="text-3xl text-[#00FF87]" />
            <div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide">
                Head-to-Head
              </h3>
              <p className="text-xs text-[#555] font-semibold mt-1">
                Overlay attributes and compare performance stats.
              </p>
            </div>
          </Link>

          {/* Card 3: Team Builder */}
          <Link
            to="/team-builder"
            className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col justify-between h-48 transition-all hover:border-[#00FF87] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,135,0.15)]"
          >
            <FaGamepad className="text-3xl text-[#00FF87]" />
            <div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide">
                Squad Builder
              </h3>
              <p className="text-xs text-[#555] font-semibold mt-1">
                Draft formation squads and measure team chemistry.
              </p>
            </div>
          </Link>

          {/* Card 4: Analytics */}
          <Link
            to="/analytics"
            className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col justify-between h-48 transition-all hover:border-[#00FF87] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,135,0.15)]"
          >
            <FaChartBar className="text-3xl text-[#00FF87]" />
            <div>
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide">
                Aggregations
              </h3>
              <p className="text-xs text-[#555] font-semibold mt-1">
                Observe statistical distributions across clubs.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
