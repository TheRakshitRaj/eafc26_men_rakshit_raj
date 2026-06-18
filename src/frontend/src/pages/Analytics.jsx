import React, { useEffect, useState } from 'react';
import { FaChartLine, FaChartPie, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import api from '../api/axios';
import AnalyticsChart from '../components/AnalyticsChart';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Analytics states
  const [teamsData, setTeamsData] = useState([]);
  const [leaguesData, setLeaguesData] = useState([]);
  const [nationsData, setNationsData] = useState([]);
  const [positionsData, setPositionsData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          teamsRes,
          leaguesRes,
          nationsRes,
          positionsRes,
          skillsRes,
        ] = await Promise.all([
          api.get('/analytics/top-teams'),
          api.get('/analytics/top-leagues'),
          api.get('/analytics/top-nations'),
          api.get('/analytics/position-distribution'),
          api.get('/analytics/skill-distribution'),
        ]);

        // 1. Top Teams by Avg Overall
        if (teamsRes.data?.data) {
          const formatted = teamsRes.data.data.map((item) => ({
            name: item.team || 'Unknown',
            value: item.avgOverall || 0,
          }));
          setTeamsData(formatted);
        }

        // 2. Top Leagues by Avg Overall
        if (leaguesRes.data?.data) {
          const formatted = leaguesRes.data.data.map((item) => ({
            name: item.league || 'Unknown',
            value: item.avgOverall || 0,
          }));
          setLeaguesData(formatted);
        }

        // 3. Top Nations by Player Count
        if (nationsRes.data?.data) {
          const formatted = nationsRes.data.data.map((item) => ({
            name: item.nation || 'Unknown',
            value: item.playerCount || 0,
          }));
          setNationsData(formatted);
        }

        // 4. Position Distribution
        if (positionsRes.data?.data) {
          const formatted = positionsRes.data.data.map((item) => ({
            name: item.position || 'N/A',
            value: item.count || 0,
          }));
          setPositionsData(formatted);
        }

        // 5. Skill moves vs weak foot distributions
        if (skillsRes.data?.data) {
          const formatted = skillsRes.data.data.slice(0, 10).map((item) => ({
            name: `SM${item.skillMoves}/WF${item.weakFoot}`,
            value: item.avgOverall || 0,
          }));
          setSkillsData(formatted);
        }
      } catch (err) {
        console.error('Error fetching analytics aggregations:', err);
        setError('Failed to compute global analytical stats from football rosters.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-up">
      {/* Page Title */}
      <div className="border-b border-[#222]/50 pb-6">
        <h1 className="font-display font-extrabold text-3xl tracking-wider text-white uppercase flex items-center space-x-3">
          <FaChartLine className="text-[#00FF87] text-2xl" />
          <span>GLOBAL AGGREGATIONS & CHARTS</span>
        </h1>
        <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
          Real-time aggregated demographic, position and quality index reports from MongoDB Atlas
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#111]/30 rounded-2xl border border-[#222]/50">
          <div className="w-12 h-12 border-4 border-[#222] border-t-[#00FF87] rounded-full animate-spin mb-4"></div>
          <p className="font-display font-semibold tracking-wider text-[#A0A0A0] text-xs animate-pulse">
            COMPUTING COMPLEX DATABASE AGGREGATIONS...
          </p>
        </div>
      ) : error ? (
        <div className="bg-[#111] border border-red-500/30 rounded-xl p-8 text-center text-red-400 font-semibold text-sm uppercase">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up">
          
          {/* Top Teams Chart */}
          <div className="col-span-1">
            <AnalyticsChart
              type="bar"
              data={teamsData}
              title="Top 10 Teams"
              description="Ranked by average player overall quality"
            />
          </div>

          {/* Top Leagues Chart */}
          <div className="col-span-1">
            <AnalyticsChart
              type="bar"
              data={leaguesData}
              title="Top 10 Leagues"
              description="Ranked by average player overall quality"
            />
          </div>

          {/* Top Nations Chart */}
          <div className="col-span-1">
            <AnalyticsChart
              type="pie"
              data={nationsData}
              title="Nationality representation"
              description="Total count of active indexed players"
            />
          </div>

          {/* Position Distribution Chart */}
          <div className="col-span-1">
            <AnalyticsChart
              type="pie"
              data={positionsData}
              title="Position distributions"
              description="Roster representation in typical tactical slots"
            />
          </div>

          {/* Skill Distribution Chart */}
          <div className="col-span-1 md:col-span-2">
            <AnalyticsChart
              type="bar"
              data={skillsData}
              title="Star Rating capabilities index"
              description="Average overall rating grouped by skill moves (SM) / weak foot (WF)"
            />
          </div>

        </div>
      )}
    </div>
  );
}
