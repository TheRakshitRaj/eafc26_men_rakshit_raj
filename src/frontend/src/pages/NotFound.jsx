import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#0A0A0A] text-white px-4 text-center animate-fade-up">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4 animate-bounce" />
      <h1 className="font-display font-extrabold text-7xl sm:text-8xl tracking-tighter text-white uppercase leading-none">
        404
      </h1>
      <h2 className="font-display font-bold text-xl sm:text-2xl text-[#00FF87] uppercase tracking-wider mt-2">
        PLAYER NOT FOUND ON THE PITCH
      </h2>
      <p className="text-xs text-[#A0A0A0] max-w-sm mt-3 uppercase tracking-wide leading-relaxed font-semibold">
        The route you are trying to access is outside the field of play. Let's return to the tactical dashboard.
      </p>
      <Link
        to="/"
        className="bg-[#00FF87] hover:bg-[#00C96B] text-black font-display font-bold tracking-wider px-6 py-3 rounded-xl transition-all duration-200 mt-8 shadow-[0_0_15px_rgba(0,255,135,0.25)] hover:shadow-[0_0_20px_rgba(0,255,135,0.4)]"
      >
        RETURN TO HOME
      </Link>
    </div>
  );
}
