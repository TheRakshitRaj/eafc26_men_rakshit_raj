import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner, FaTrophy } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve previous redirect page or fallback to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all authentication credentials.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email credentials or password entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Neon Glow Rings */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#00FF87]/5 filter blur-3xl -top-24 -left-24 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#00D8FF]/5 filter blur-3xl -bottom-24 -right-24 pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111] border border-[#222] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10 hover:shadow-[0_0_35px_rgba(0,255,135,0.1)] transition-shadow duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2">
            <span className="font-display font-extrabold text-3xl text-black bg-[#00FF87] px-2 py-0.5 rounded shadow-[0_0_15px_rgba(0,255,135,0.35)]">
              FC26
            </span>
            <span className="font-display font-bold text-2xl tracking-wider text-white">
              ANALYTICS
            </span>
          </div>
          <p className="text-xs text-[#555] font-semibold uppercase tracking-wider">
            SECURE ACCESS SYSTEM PORTAL
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3.5 text-xs text-red-500 font-semibold uppercase tracking-wide text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@analytics.com"
              required
              className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg px-3.5 py-3 placeholder-[#555] focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg pl-3.5 pr-10 py-3 placeholder-[#555] focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#555] hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Pass */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#A0A0A0]">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded bg-[#1A1A1A] border-[#333] text-[#00FF87] focus:ring-[#00FF87]"
              />
              <span>REMEMBER ME</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00FF87] hover:bg-[#00C96B] disabled:bg-[#00C96B]/50 text-black font-display font-bold tracking-wider py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,255,135,0.2)] hover:shadow-[0_0_30px_rgba(0,255,135,0.4)] disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>VERIFYING PROFILE...</span>
              </>
            ) : (
              <span>SIGN IN TO DATABASE</span>
            )}
          </button>
        </form>

        {/* Footer Redirect link */}
        <div className="text-center border-t border-[#222]/50 pt-4 text-xs text-[#555] font-semibold">
          DON'T HAVE AN ACCOUNT?{' '}
          <Link to="/register" className="text-[#00FF87] hover:text-[#00C96B] hover:underline uppercase">
            REGISTER HERE
          </Link>
        </div>

      </div>
    </div>
  );
}
