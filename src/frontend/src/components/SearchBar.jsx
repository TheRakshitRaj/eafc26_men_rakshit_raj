import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import useDebounce from '../hooks/useDebounce';

export default function SearchBar({
  onSearch,
  placeholder = 'Search players by name, club, nation, or position...',
  value: initialValue = '',
  loading = false,
}) {
  const [query, setQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(query, 400);

  // Sync state if initial value changes externally
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Trigger onSearch only when debounced query updates
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="relative w-full">
      {/* Search Icon / Spinner */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555555]">
        {loading ? (
          <FaSpinner className="w-4 h-4 text-[#00FF87] animate-spin" />
        ) : (
          <FaSearch className="w-4 h-4 group-focus-within:text-[#00FF87] transition-colors" />
        )}
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-[#1A1A1A] border border-[#333333] text-white placeholder-[#555555] rounded-xl focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] font-body text-sm transition-all duration-200"
      />

      {/* Clear Button */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#555555] hover:text-white transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
