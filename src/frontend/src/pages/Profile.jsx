import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaRegCalendarAlt, FaEnvelope, FaShieldAlt, FaSpinner, FaSignOutAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!username || !email) {
      setErrorMsg('Username and email fields are required.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await updateProfile({ username, email });
      setSuccessMsg('Profile settings updated successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Failed to update profile settings:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile configurations.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/login');
  };

  // Convert mongoose createdAt string to simple readable date format
  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Roster Member';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-up">
      {/* Title */}
      <div className="border-b border-[#222]/50 pb-6">
        <h1 className="font-display font-extrabold text-3xl tracking-wider text-white uppercase flex items-center space-x-3">
          <FaUser className="text-[#00FF87] text-2xl" />
          <span>MY PLATFORM PROFILE</span>
        </h1>
        <p className="text-xs text-[#555] font-semibold uppercase mt-0.5">
          Review credentials, access role configurations, and manage user parameters
        </p>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="bg-[#00FF87]/10 border border-[#00FF87]/30 rounded-xl p-4 flex items-center space-x-3 text-[#00FF87] text-xs font-semibold uppercase tracking-wide animate-fade-up">
          <FaCheckCircle className="text-lg flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3 text-red-500 text-xs font-semibold uppercase tracking-wide animate-fade-up">
          <FaExclamationTriangle className="text-lg flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Avatar Details Card */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 text-center space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-[#00FF87]/10 border-2 border-[#00FF87]/30 flex items-center justify-center text-4xl font-display font-extrabold text-[#00FF87] mx-auto uppercase">
              {user?.username?.substring(0, 2) || 'US'}
            </div>
            
            <div>
              <h2 className="font-display font-extrabold text-xl text-white uppercase tracking-wide truncate">
                {user?.username}
              </h2>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-display font-extrabold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/20 uppercase tracking-widest mt-1">
                {user?.role === 'admin' ? <FaShieldAlt className="text-[8px] mr-1" /> : null}
                <span>{user?.role}</span>
              </span>
            </div>
          </div>

          <div className="border-t border-[#222]/50 pt-4 space-y-3 text-left text-xs text-[#A0A0A0] font-semibold">
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-[#555] text-xs" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaRegCalendarAlt className="text-[#555] text-xs" />
              <span>Joined {formatJoinDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form Card */}
        <div className="md:col-span-2 bg-[#111] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase border-b border-[#222]/50 pb-3">
            PROFILE PARAMETERS
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Manager name"
                required
                className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg px-3.5 py-3 placeholder-[#555] focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Manager email"
                required
                className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg px-3.5 py-3 placeholder-[#555] focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00FF87] hover:bg-[#00C96B] disabled:bg-[#00C96B]/50 text-black font-display font-bold tracking-wider text-xs px-6 py-3 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,255,135,0.2)]"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>UPDATING SETTINGS...</span>
                </>
              ) : (
                <span>SAVE CONFIGURATIONS</span>
              )}
            </button>
          </form>

          {/* Danger Zone */}
          <div className="border-t border-red-500/20 pt-6 mt-6">
            <h4 className="text-xs font-display font-bold text-red-500 uppercase tracking-wider mb-3">
              SYSTEM DISCONNECT
            </h4>
            <button
              onClick={handleLogoutClick}
              className="w-full bg-[#FF3B3B] hover:bg-red-700 text-white font-display font-bold tracking-wider py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <FaSignOutAlt />
              <span>TERMINATE ACTIVE SESSION</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
