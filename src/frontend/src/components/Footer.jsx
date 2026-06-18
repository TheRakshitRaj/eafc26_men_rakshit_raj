import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222222] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="font-display font-extrabold text-lg text-black bg-[#00FF87] px-1.5 py-0.5 rounded">
            FC26
          </span>
          <span className="font-display font-bold tracking-wider text-white">
            ANALYTICS
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs text-[#A0A0A0] text-center max-w-md mb-6 leading-relaxed">
          Elite-level analytics, stats comparison, and squad planning dashboard designed around EA Sports FC 26 player profiles.
        </p>

        {/* Navigation Map */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6">
          <Link to="/" className="text-xs text-[#A0A0A0] hover:text-[#00FF87] transition-colors">HOME</Link>
          <Link to="/players" className="text-xs text-[#A0A0A0] hover:text-[#00FF87] transition-colors">PLAYERS</Link>
          <Link to="/compare" className="text-xs text-[#A0A0A0] hover:text-[#00FF87] transition-colors">COMPARE</Link>
          <Link to="/analytics" className="text-xs text-[#A0A0A0] hover:text-[#00FF87] transition-colors">ANALYTICS</Link>
          <Link to="/team-builder" className="text-xs text-[#A0A0A0] hover:text-[#00FF87] transition-colors">TEAM BUILDER</Link>
        </div>

        {/* Disclaimer and Copyright */}
        <div className="text-center border-t border-[#222]/30 w-full pt-4">
          <p className="text-[10px] text-[#555555] tracking-wider uppercase mb-1">
            DISCLAIMER: This project is an independent fansite / portfolio piece and is NOT affiliated with, authorized, or endorsed by Electronic Arts Inc. or EA Sports.
          </p>
          <p className="text-[10px] text-[#555555]">
            &copy; {currentYear} EA FC 26 Analytics Platform. Created for research and analytics presentation.
          </p>
        </div>

      </div>
    </footer>
  );
}
