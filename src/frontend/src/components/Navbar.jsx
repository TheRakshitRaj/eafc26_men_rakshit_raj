import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown, FaShieldAlt } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/players', label: 'PLAYERS' },
    { path: '/compare', label: 'COMPARE' },
    { path: '/analytics', label: 'ANALYTICS' },
    { path: '/team-builder', label: 'TEAM BUILDER' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#222222] transition-all duration-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="font-display font-extrabold text-2xl tracking-tighter text-black bg-[#00FF87] px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,255,135,0.4)]">
            FC26
          </span>
          <span className="font-display font-bold text-lg tracking-wider text-white group-hover:text-[#00FF87] transition-colors duration-200">
            ANALYTICS
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex space-x-8 h-full items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `font-display font-semibold tracking-wider text-sm h-full flex items-center border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'border-[#00FF87] text-[#00FF87]'
                    : 'border-transparent text-[#A0A0A0] hover:text-white hover:border-[#A0A0A0]/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {/* Optional Admin Link in desktop */}
          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `font-display font-semibold tracking-wider text-sm h-full flex items-center border-b-2 transition-all duration-200 text-yellow-400 ${
                  isActive
                    ? 'border-yellow-400'
                    : 'border-transparent hover:text-yellow-300 hover:border-yellow-400/50'
                }`
              }
            >
              ADMIN
            </NavLink>
          )}
        </div>

        {/* Right: Desktop Auth Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-[#111111] border border-[#222] px-3 py-1.5 rounded-lg hover:border-[#00FF87] transition-all duration-200 text-sm font-semibold"
              >
                <div className="w-6 h-6 rounded-full bg-[#00FF87]/20 border border-[#00FF87]/40 flex items-center justify-center text-[#00FF87] font-bold text-xs uppercase">
                  {user?.username?.substring(0, 2) || 'US'}
                </div>
                <span className="text-white max-w-[100px] truncate">{user?.username}</span>
                <FaChevronDown className={`text-xs text-[#A0A0A0] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1A1A1A] border border-[#222] shadow-xl py-2 z-20 animate-fade-up">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#222] transition-colors"
                    >
                      <FaUser className="text-xs" />
                      <span>My Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-[#222] transition-colors"
                      >
                        <FaShieldAlt className="text-xs" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <div className="border-t border-[#222] my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-[#222] transition-colors"
                    >
                      <FaSignOutAlt className="text-xs" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-[#A0A0A0] hover:text-white px-3 py-1.5 text-sm font-semibold transition-colors duration-200"
              >
                LOG IN
              </Link>
              <Link
                to="/register"
                className="bg-[#00FF87] hover:bg-[#00C96B] text-black px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(0,255,135,0.25)] hover:shadow-[0_0_20px_rgba(0,255,135,0.4)]"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#A0A0A0] hover:text-white focus:outline-none p-1"
          >
            {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile: Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-[#0A0A0A] border-t border-[#222222] z-40 px-4 py-6 flex flex-col justify-between">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `font-display font-bold text-xl tracking-wider py-3 border-b border-[#222]/30 transition-all ${
                    isActive ? 'text-[#00FF87]' : 'text-[#A0A0A0] hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `font-display font-bold text-xl tracking-wider py-3 border-b border-[#222]/30 text-yellow-400 ${
                    isActive ? 'text-yellow-300' : 'hover:text-yellow-300'
                  }`
                }
              >
                ADMIN PANEL
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `font-display font-bold text-xl tracking-wider py-3 border-b border-[#222]/30 text-[#A0A0A0] ${
                    isActive ? 'text-white' : 'hover:text-white'
                  }`
                }
              >
                MY PROFILE
              </NavLink>
            )}
          </div>

          <div className="pb-12 flex flex-col space-y-4">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-[#00FF87]/20 border border-[#00FF87]/40 flex items-center justify-center text-[#00FF87] font-bold text-sm uppercase">
                    {user?.username?.substring(0, 2) || 'US'}
                  </div>
                  <span className="text-white text-base font-semibold">{user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#FF3B3B] hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all text-center flex items-center justify-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>LOG OUT</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full border border-[#222] hover:border-[#00FF87] text-white py-3 rounded-lg text-center font-bold transition-all"
                >
                  LOG IN
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-[#00FF87] hover:bg-[#00C96B] text-black py-3 rounded-lg text-center font-bold transition-all shadow-[0_0_15px_rgba(0,255,135,0.25)]"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
