import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border-t border-[#222]/50 pt-5 w-full">
      {/* Page indicator text */}
      <span className="text-xs text-[#555] font-semibold uppercase tracking-wider">
        Page <span className="text-white font-mono">{currentPage}</span> of <span className="text-white font-mono">{totalPages}</span>
      </span>

      {/* Navigation Controls */}
      <div className="flex items-center space-x-1.5">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-8 h-8 rounded bg-[#111] border border-[#222] text-[#A0A0A0] hover:text-[#00FF87] hover:border-[#00FF87] disabled:opacity-30 disabled:hover:text-[#A0A0A0] disabled:hover:border-[#222] disabled:cursor-not-allowed transition-all"
        >
          <FaChevronLeft className="text-xs" />
        </button>

        {/* First page indicator if not in list */}
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded font-mono text-xs font-bold border border-[#222] bg-[#111] text-[#A0A0A0] hover:text-[#00FF87] hover:border-[#00FF87] transition-all"
            >
              1
            </button>
            {pages[0] > 2 && <span className="text-[#555] text-xs font-bold px-1 select-none">...</span>}
          </>
        )}

        {/* Page numbers */}
        {pages.map((p) => {
          const isSelected = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded font-mono text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-[#00FF87] border-[#00FF87] text-black shadow-[0_0_10px_rgba(0,255,135,0.25)]'
                  : 'bg-[#111] border-[#222] text-[#A0A0A0] hover:text-[#00FF87] hover:border-[#00FF87]'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Last page indicator if not in list */}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-[#555] text-xs font-bold px-1 select-none">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded font-mono text-xs font-bold border border-[#222] bg-[#111] text-[#A0A0A0] hover:text-[#00FF87] hover:border-[#00FF87] transition-all"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-8 h-8 rounded bg-[#111] border border-[#222] text-[#A0A0A0] hover:text-[#00FF87] hover:border-[#00FF87] disabled:opacity-30 disabled:hover:text-[#A0A0A0] disabled:hover:border-[#222] disabled:cursor-not-allowed transition-all"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  );
}
