'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';

/**
 * Modern search bar with debounced input
 * Updates global search query in Zustand store
 */
export function SearchBar() {
  const { searchQuery, setSearchQuery } = useNoteStore();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce: update store 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center rounded-full border-2 transition-all duration-200 ${
          isFocused
            ? 'border-blue-500 bg-white dark:bg-zinc-900 shadow-lg shadow-blue-500/20'
            : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950'
        }`}
      >
        <Search className="absolute left-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Tìm kiếm ghi chú..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent pl-12 pr-12 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
