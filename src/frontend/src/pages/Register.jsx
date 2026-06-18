import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Field validation errors
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Run validations on input changes
  useEffect(() => {
    const newErrors = {};

    // 1. Username Validation (3-20 chars)
    if (username && (username.length < 3 || username.length > 20)) {
      newErrors.username = 'Username must be between 3 and 20 characters.';
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 3. Password Validation (min 8 chars, must contain number and uppercase)
    const hasNumber = /\d/;
    const hasUpper = /[A-Z]/;
    if (password) {
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.';
      } else if (!hasNumber.test(password)) {
        newErrors.password = 'Password must contain at least one number.';
      } else if (!hasUpper.test(password)) {
        newErrors.password = 'Password must contain at least one uppercase letter.';
      }
    }

    // 4. Confirm Password Validation
    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    // Form is valid if all fields are filled and no validation errors exist
    const formFilled = username && email && password && confirmPassword;
    setIsValid(formFilled && Object.keys(newErrors).length === 0);
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setApiError(null);
    try {
      await register(username, email, password);
      // Success redirection with temporary success state
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      console.error('Registration failed:', err);
      setApiError(err.response?.data?.message || 'Failed to complete registration on backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow rings */}
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
            DATABASE REGISTRATION WIZARD
          </p>
        </div>

        {/* API Error Alert Box */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3.5 text-xs text-red-500 font-semibold uppercase tracking-wide text-center animate-pulse">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username */}
          <div className="space-y-1">
            <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. manager1"
              required
              className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg px-3.5 py-2.5 placeholder-[#555] focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
            />
            {errors.username && <p className="text-[10px] text-red-500 font-semibold uppercase">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. manager1@analytics.com"
              required
              className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg px-3.5 py-2.5 placeholder-[#555] focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
            />
            {errors.email && <p className="text-[10px] text-red-500 font-semibold uppercase">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 number, 1 upper"
                required
                className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg pl-3.5 pr-10 py-2.5 placeholder-[#555] focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#555] hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-semibold uppercase">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-xs font-display font-bold text-[#A0A0A0] uppercase tracking-wider">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              required
              className="w-full bg-[#1A1A1A] border border-[#333] text-white text-sm rounded-lg px-3.5 py-2.5 placeholder-[#555] focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
            />
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-500 font-semibold uppercase">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-[#00FF87] hover:bg-[#00C96B] disabled:bg-[#333] disabled:text-[#555] disabled:shadow-none text-black font-display font-bold tracking-wider py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,255,135,0.2)] hover:shadow-[0_0_30px_rgba(0,255,135,0.4)] disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>SAVING USER PROFILE...</span>
              </>
            ) : (
              <span>REGISTER ACCOUNT</span>
            )}
          </button>
        </form>

        {/* Footer Redirect link */}
        <div className="text-center border-t border-[#222]/50 pt-4 text-xs text-[#555] font-semibold">
          ALREADY HAVE AN ACCOUNT?{' '}
          <Link to="/login" className="text-[#00FF87] hover:text-[#00C96B] hover:underline uppercase">
            LOG IN HERE
          </Link>
        </div>

      </div>
    </div>
  );
}
