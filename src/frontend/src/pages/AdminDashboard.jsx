import React, { useEffect, useState, useMemo } from 'react';
import {
  FaUserShield, FaUsers, FaGamepad, FaTrash, FaEdit, FaPlus, FaSpinner,
  FaTimes, FaTrashRestore, FaListAlt, FaChevronLeft, FaChevronRight, FaTrophy, FaCalendarAlt
} from 'react-icons/fa';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';

export default function AdminDashboard() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState(null);

  // Administrative summary state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlayers: 0,
    admins: 0,
    deletedPlayers: 0,
    recentUsers: [],
    recentPlayers: [],
  });

  // Roster table state
  const [playersList, setPlayersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlayers, setTotalPlayers] = useState(0);

  // Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null); // null means creating
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Form inputs state
  const [formData, setFormData] = useState({
    name: '',
    overall: 80,
    pace: 80,
    shooting: 80,
    passing: 80,
    dribbling: 80,
    defending: 80,
    physical: 80,
    team: '',
    league: '',
    nation: '',
    position: 'CM',
    age: 24,
    weakFoot: 3,
    skillMoves: 3,
    preferredFoot: 'Right',
    gender: 'Male',
  });

  // Load admin stats
  const fetchAdminStats = async () => {
    setLoadingStats(true);
    try {
      const response = await api.get('/admin/dashboard');
      const data = response.data?.data;
      if (data) {
        setStats({
          totalUsers: data.users?.total || 0,
          admins: data.users?.admins || 0,
          activePlayers: data.players?.active || 0,
          deletedPlayers: data.players?.deleted || 0,
          recentUsers: data.recentUsers || [],
          recentPlayers: data.recentPlayers || [],
        });
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load paginated list of players
  const fetchPlayersList = async (page = 1) => {
    setLoadingPlayers(true);
    try {
      const response = await api.get('/players', {
        params: { page, limit: 10, sort: '-createdAt' },
      });
      const data = response.data;
      setPlayersList(data.data || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalPlayers(data.pagination.totalPlayers || 0);
        setCurrentPage(data.pagination.page || 1);
      }
    } catch (err) {
      console.error('Failed to load players list:', err);
      setError('Failed to fetch player database tables.');
    } finally {
      setLoadingPlayers(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    fetchPlayersList(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPlayersList(newPage);
    }
  };

  // Delete Action
  const handleDelete = async (id) => {
    const confirmText = 'Are you sure you want to soft-delete this player from index?';
    if (!window.confirm(confirmText)) return;

    try {
      await api.delete(`/players/${id}`);
      alert('Player soft-deleted successfully.');
      fetchAdminStats();
      fetchPlayersList(currentPage);
    } catch (err) {
      console.error('Failed to delete player:', err);
      alert(err.response?.data?.message || 'Delete operation rejected.');
    }
  };

  // Form modal triggers
  const openCreateModal = () => {
    setEditingPlayer(null);
    setFormData({
      name: '',
      overall: 80,
      pace: 80,
      shooting: 80,
      passing: 80,
      dribbling: 80,
      defending: 80,
      physical: 80,
      team: '',
      league: '',
      nation: '',
      position: 'CM',
      age: 24,
      weakFoot: 3,
      skillMoves: 3,
      preferredFoot: 'Right',
      gender: 'Male',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name || '',
      overall: player.overall || 80,
      pace: player.pace || 80,
      shooting: player.shooting || 80,
      passing: player.passing || 80,
      dribbling: player.dribbling || 80,
      defending: player.defending || 80,
      physical: player.physical || 80,
      team: player.team || '',
      league: player.league || '',
      nation: player.nation || '',
      position: player.position || 'CM',
      age: player.age || 24,
      weakFoot: player.weakFoot || 3,
      skillMoves: player.skillMoves || 3,
      preferredFoot: player.preferredFoot || 'Right',
      gender: player.gender || 'Male',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      if (editingPlayer) {
        // Update (PATCH / PUT)
        await api.patch(`/players/${editingPlayer._id}`, formData);
      } else {
        // Create (POST)
        await api.post('/players', formData);
      }
      setModalOpen(false);
      fetchAdminStats();
      fetchPlayersList(editingPlayer ? currentPage : 1);
    } catch (err) {
      console.error('Form submit failed:', err);
      setFormError(err.response?.data?.message || 'Validation failed. Check input bounds.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-up">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#222]/50 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-wider text-white uppercase flex items-center space-x-3">
            <FaUserShield className="text-[#00FF87] text-2xl" />
            <span>ADMINISTRATOR TERMINAL</span>
          </h1>
          <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
            Database access controls, player record modifications, and session feeds
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-[#00FF87] hover:bg-[#00C96B] text-black font-display font-bold text-xs px-5 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,135,0.25)] hover:shadow-[0_0_20px_rgba(0,255,135,0.4)]"
        >
          <FaPlus />
          <span>ADD NEW PLAYER</span>
        </button>
      </div>

      {/* Stats KPI Widgets Row */}
      {loadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-[#111] border border-[#222] rounded-xl h-24 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up">
          <StatsCard label="Registered Users" value={stats.totalUsers} icon={FaUsers} />
          <StatsCard label="Active Players" value={stats.activePlayers} icon={FaGamepad} />
          <StatsCard label="Admin Accounts" value={stats.admins} icon={FaUserShield} />
          <StatsCard label="Soft Deleted" value={stats.deletedPlayers} icon={FaTrash} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Database Table (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase border-b border-[#222]/50 pb-3 flex items-center space-x-2">
            <FaListAlt className="text-[#00FF87] text-xs" />
            <span>DATABASE MANAGE TABLE</span>
          </h3>

          <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#181818]/60 border-b border-[#222] text-[#A0A0A0] font-display font-bold uppercase tracking-wider">
                    <th className="px-5 py-4">Player Name</th>
                    <th className="px-4 py-4 text-center">OVR</th>
                    <th className="px-4 py-4 text-center">POS</th>
                    <th className="px-4 py-4">Club Team</th>
                    <th className="px-4 py-4">Nation</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]/40 font-semibold text-[#A0A0A0]">
                  {loadingPlayers ? (
                    <tr>
                      <td colSpan="6" className="text-center py-20">
                        <FaSpinner className="animate-spin text-lg text-[#00FF87] mx-auto mb-2" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#555]">LOADING DATABASE RECORDS...</span>
                      </td>
                    </tr>
                  ) : playersList.length > 0 ? (
                    playersList.map((player) => (
                      <tr key={player._id} className="hover:bg-[#1A1A1A]/40 transition-colors">
                        <td className="px-5 py-3.5 text-white font-display font-bold uppercase tracking-wide">
                          {player.name}
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono font-bold text-[#00FF87]">
                          {player.overall}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="bg-[#1A1A1A] border border-[#222] text-white px-2 py-0.5 rounded text-[10px] font-mono">
                            {player.position}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 truncate max-w-[120px]">{player.team}</td>
                        <td className="px-4 py-3.5 truncate max-w-[100px]">{player.nation}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => openEditModal(player)}
                              className="text-[#A0A0A0] hover:text-[#00FF87] p-1.5 rounded bg-[#1A1A1A] border border-[#222] hover:border-[#00FF87]/50 transition-colors"
                              title="Edit record"
                            >
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              onClick={() => handleDelete(player._id)}
                              className="text-[#A0A0A0] hover:text-red-500 p-1.5 rounded bg-[#1A1A1A] border border-[#222] hover:border-red-500/50 transition-colors"
                              title="Delete record"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-[#555] uppercase font-bold tracking-wider">
                        No players exist in database index rosters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-[#181818]/40 border-t border-[#222] px-5 py-4 flex items-center justify-between">
                <span className="text-[10px] text-[#555] uppercase font-bold tracking-wider">
                  Page <span className="text-white font-mono">{currentPage}</span> of <span className="text-white font-mono">{totalPages}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loadingPlayers}
                    className="p-2 bg-[#1A1A1A] border border-[#222] text-[#A0A0A0] hover:text-[#00FF87] hover:border-[#00FF87] disabled:opacity-30 disabled:hover:text-[#A0A0A0] disabled:hover:border-[#222] rounded transition-all"
                  >
                    <FaChevronLeft className="text-[10px]" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loadingPlayers}
                    className="p-2 bg-[#1A1A1A] border border-[#222] text-[#A0A0A0] hover:text-[#00FF87] hover:border-[#00FF87] disabled:opacity-30 disabled:hover:text-[#A0A0A0] disabled:hover:border-[#222] rounded transition-all"
                  >
                    <FaChevronRight className="text-[10px]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Feeds (Slot column 3) */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase border-b border-[#222]/50 pb-3 flex items-center space-x-2">
            <FaUsers className="text-[#00FF87] text-xs" />
            <span>RECENT USERS FEED</span>
          </h3>

          <div className="bg-[#111] border border-[#222] rounded-xl p-4 space-y-4 max-h-[480px] overflow-y-auto">
            {loadingStats ? (
              <div className="text-center py-10 text-xs text-[#555] animate-pulse">LOADING ACCESS LOGS...</div>
            ) : stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((u, idx) => (
                <div key={idx} className="border-b border-[#222]/40 pb-3 last:border-0 last:pb-0 text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="text-white uppercase font-display font-bold tracking-wide">{u.username}</span>
                    <span className="text-[9px] bg-[#222] text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded uppercase font-display font-bold tracking-widest">{u.role}</span>
                  </div>
                  <p className="text-[#555] truncate mt-1">{u.email}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#555] uppercase italic font-bold">No users registered in index logs.</p>
            )}
          </div>
        </div>

      </div>

      {/* Create / Edit Form Modal (Slide Over panel) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#0A0A0A] border-l border-[#222] flex flex-col shadow-xl animate-fade-up">
              
              {/* Modal Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-[#222]">
                <h3 className="text-base font-display font-extrabold text-white tracking-wider uppercase">
                  {editingPlayer ? 'EDIT PLAYER RECORD' : 'CREATE PLAYER PROFILE'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-[#555] hover:text-white p-1">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400 font-semibold uppercase text-center animate-pulse">
                    {formError}
                  </div>
                )}

                {/* Main Info */}
                <div className="space-y-4 border-b border-[#222]/40 pb-5">
                  <h4 className="text-xs font-display font-bold text-[#00FF87] uppercase tracking-widest">General Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Team / Club</label>
                      <input
                        type="text"
                        name="team"
                        value={formData.team}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">League</label>
                      <input
                        type="text"
                        name="league"
                        value={formData.league}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Nation</label>
                      <input
                        type="text"
                        name="nation"
                        value={formData.nation}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. ST, CM, GK"
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Qualities & Ratings */}
                <div className="space-y-4 border-b border-[#222]/40 pb-5">
                  <h4 className="text-xs font-display font-bold text-[#00FF87] uppercase tracking-widest">Ratings & Bios</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">OVR (1-99)</label>
                      <input
                        type="number"
                        name="overall"
                        min="1"
                        max="99"
                        value={formData.overall}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Age (15-50)</label>
                      <input
                        type="number"
                        name="age"
                        min="15"
                        max="50"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Preferred Foot</label>
                      <select
                        name="preferredFoot"
                        value={formData.preferredFoot}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      >
                        <option value="Right">Right</option>
                        <option value="Left">Left</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Weak Foot (1-5)</label>
                      <input
                        type="number"
                        name="weakFoot"
                        min="1"
                        max="5"
                        value={formData.weakFoot}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Skill Moves (1-5)</label>
                      <input
                        type="number"
                        name="skillMoves"
                        min="1"
                        max="5"
                        value={formData.skillMoves}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sub Attributes */}
                <div className="space-y-4">
                  <h4 className="text-xs font-display font-bold text-[#00FF87] uppercase tracking-widest">Skill Attributes (1-99)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Pace</label>
                      <input
                        type="number"
                        name="pace"
                        min="1"
                        max="99"
                        value={formData.pace}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Shooting</label>
                      <input
                        type="number"
                        name="shooting"
                        min="1"
                        max="99"
                        value={formData.shooting}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Passing</label>
                      <input
                        type="number"
                        name="passing"
                        min="1"
                        max="99"
                        value={formData.passing}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Dribbling</label>
                      <input
                        type="number"
                        name="dribbling"
                        min="1"
                        max="99"
                        value={formData.dribbling}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Defending</label>
                      <input
                        type="number"
                        name="defending"
                        min="1"
                        max="99"
                        value={formData.defending}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#A0A0A0] font-bold uppercase">Physical</label>
                      <input
                        type="number"
                        name="physical"
                        min="1"
                        max="99"
                        value={formData.physical}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1A1A] border border-[#222] text-white text-xs rounded-lg px-3 py-2.5 focus:border-[#00FF87] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions footer */}
                <div className="pt-6 border-t border-[#222] flex space-x-3 mt-8">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-[#00FF87] hover:bg-[#00C96B] disabled:bg-[#00C96B]/50 text-black font-display font-bold py-3 rounded-lg text-xs tracking-wider uppercase flex items-center justify-center space-x-2"
                  >
                    {formLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>SAVING...</span>
                      </>
                    ) : (
                      <span>COMMIT RECORD</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 bg-transparent border border-[#222] hover:border-red-500/50 text-[#A0A0A0] hover:text-red-400 font-display font-bold py-3 rounded-lg text-xs tracking-wider uppercase"
                  >
                    DISCARD
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
