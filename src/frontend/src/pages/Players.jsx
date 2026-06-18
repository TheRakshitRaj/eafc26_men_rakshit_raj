import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaTimes, FaSortAmountDown, FaThList, FaTh } from 'react-icons/fa';
import usePlayers from '../hooks/usePlayers';
import PlayerCard from '../components/PlayerCard';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

export default function Players() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { players, loading, error, totalPages, totalPlayers, fetchPlayers } = usePlayers();
  
  // Mobile drawer filter visibility state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

  // Sync state from query parameters in URL
  const queryParams = useMemo(() => {
    return {
      q: searchParams.get('q') || '',
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
      sort: searchParams.get('sort') || '-overall',
      team: searchParams.get('team') || '',
      league: searchParams.get('league') || '',
      nation: searchParams.get('nation') || '',
      position: searchParams.get('position') || '',
      preferredFoot: searchParams.get('preferredFoot') || '',
      overall_gte: searchParams.get('overall_gte') || '',
      overall_lte: searchParams.get('overall_lte') || '',
      age_gte: searchParams.get('age_gte') || '',
      age_lte: searchParams.get('age_lte') || '',
    };
  }, [searchParams]);

  // Map filters object for Filters component
  const filterProps = useMemo(() => {
    return {
      team: queryParams.team,
      league: queryParams.league,
      nation: queryParams.nation,
      positions: queryParams.position ? queryParams.position.split(',').filter(Boolean) : [],
      preferredFoot: queryParams.preferredFoot,
      minOverall: queryParams.overall_gte ? parseInt(queryParams.overall_gte, 10) : 40,
      maxOverall: queryParams.overall_lte ? parseInt(queryParams.overall_lte, 10) : 99,
      minAge: queryParams.age_gte ? parseInt(queryParams.age_gte, 10) : 16,
      maxAge: queryParams.age_lte ? parseInt(queryParams.age_lte, 10) : 45,
    };
  }, [queryParams]);

  useEffect(() => {
    fetchPlayers(queryParams);
  }, [queryParams, fetchPlayers]);

  const updateQueryParams = (newParams) => {
    const updated = { ...queryParams, ...newParams, page: newParams.page || 1 }; // Reset to page 1 for filter updates
    
    // Clean up empty params
    const cleanParams = {};
    Object.keys(updated).forEach((key) => {
      if (updated[key] !== undefined && updated[key] !== null && updated[key] !== '') {
        cleanParams[key] = String(updated[key]);
      }
    });

    setSearchParams(cleanParams);
  };

  const handleSearch = (q) => {
    if (q !== queryParams.q) {
      updateQueryParams({ q, page: 1 });
    }
  };

  const handleFilterChange = (filtersObj) => {
    updateQueryParams({
      team: filtersObj.team,
      league: filtersObj.league,
      nation: filtersObj.nation,
      position: (filtersObj.positions || []).join(','),
      preferredFoot: filtersObj.preferredFoot,
      overall_gte: filtersObj.minOverall !== 40 ? String(filtersObj.minOverall) : '',
      overall_lte: filtersObj.maxOverall !== 99 ? String(filtersObj.maxOverall) : '',
      age_gte: filtersObj.minAge !== 16 ? String(filtersObj.minAge) : '',
      age_lte: filtersObj.maxAge !== 45 ? String(filtersObj.maxAge) : '',
      page: 1,
    });
    setMobileFiltersOpen(false);
  };

  const handleFilterReset = () => {
    setSearchParams({ sort: '-overall', page: '1' });
    setMobileFiltersOpen(false);
  };

  const handlePageChange = (newPage) => {
    updateQueryParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    updateQueryParams({ sort: e.target.value, page: 1 });
  };

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterProps.team) count++;
    if (filterProps.league) count++;
    if (filterProps.nation) count++;
    if (filterProps.positions.length > 0) count++;
    if (filterProps.preferredFoot) count++;
    if (filterProps.minOverall !== 40 || filterProps.maxOverall !== 99) count++;
    if (filterProps.minAge !== 16 || filterProps.maxAge !== 45) count++;
    return count;
  }, [filterProps]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-up">
      {/* Page Title & Search Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222]/50 pb-6 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-wider text-white uppercase">
            PLAYER DATABASE
          </h1>
          <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
            Search, sort and filter through the complete footballer index
          </p>
        </div>
        <div className="w-full md:max-w-md">
          <SearchBar onSearch={handleSearch} value={queryParams.q} loading={loading} />
        </div>
      </div>

      {/* Main Grid: Filters Sidebar (Desktop) + Player Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter Column (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <Filters filters={filterProps} onChange={handleFilterChange} onReset={handleFilterReset} />
        </div>

        {/* Right Side: Player Grid Column */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm">
            <div className="text-[#A0A0A0] font-semibold">
              Found <span className="text-[#00FF87] font-mono">{totalPlayers}</span> players
            </div>

            <div className="flex items-center space-x-3">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <FaSortAmountDown className="text-[#555] text-xs" />
                <select
                  value={queryParams.sort}
                  onChange={handleSortChange}
                  className="bg-[#1A1A1A] border border-[#333] text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-[#00FF87] focus:outline-none"
                >
                  <option value="-overall">OVR: High to Low</option>
                  <option value="overall">OVR: Low to High</option>
                  <option value="-pace">PAC: High to Low</option>
                  <option value="-shooting">SHO: High to Low</option>
                  <option value="-passing">PAS: High to Low</option>
                  <option value="-dribbling">DRI: High to Low</option>
                  <option value="-defending">DEF: High to Low</option>
                  <option value="-physical">PHY: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden bg-[#1A1A1A] border border-[#333] text-white hover:border-[#00FF87] p-2 rounded-lg text-xs font-bold transition-all relative"
              >
                <FaFilter className="text-xs" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#00FF87] text-black w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-extrabold shadow">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Player Grid Canvas */}
          {error ? (
            <div className="bg-[#111] border border-red-500/30 rounded-xl p-8 text-center space-y-4">
              <p className="text-red-400 font-semibold text-sm uppercase">{error}</p>
              <button
                onClick={() => fetchPlayers(queryParams)}
                className="bg-[#1A1A1A] border border-[#333] hover:border-red-400 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                RETRY LOAD
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="bg-[#111] border border-[#222] rounded-xl h-72 animate-pulse"></div>
              ))}
            </div>
          ) : players.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {players.map((player) => (
                  <PlayerCard key={player._id} player={player} />
                ))}
              </div>
              <Pagination
                currentPage={queryParams.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="bg-[#111] border border-[#222] rounded-xl p-12 text-center space-y-4">
              <p className="text-[#A0A0A0] text-sm font-semibold uppercase">No players found matching current parameters</p>
              <button
                onClick={handleFilterReset}
                className="bg-[#00FF87] hover:bg-[#00C96B] text-black font-display font-bold tracking-wider text-xs px-4 py-2 rounded-lg transition-all"
              >
                RESET FILTERS
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Slide-over Drawer Filters (Mobile) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0A0A0A] border-l border-[#222] flex flex-col shadow-xl animate-fade-up">
              {/* Drawer Close Button Header */}
              <div className="px-4 py-4 flex items-center justify-between border-b border-[#222]">
                <h3 className="text-sm font-display font-extrabold text-white tracking-wider uppercase">
                  FILTERING DRAWER
                </h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-[#555] hover:text-white p-1">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <Filters filters={filterProps} onChange={handleFilterChange} onReset={handleFilterReset} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
