'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';
import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState('');
  const debouncedValue = useDebounce(input, SEARCH_DEBOUNCE_MS);
  const lastSent = useRef('');

  useEffect(() => {
    if (debouncedValue !== lastSent.current) {
      lastSent.current = debouncedValue;
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  return (
    <div className="border-b-[0.5px] border-foreground pb-2 flex items-center gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a smartphone..."
        aria-label="Search for a smartphone"
        className="flex-1 bg-transparent font-light text-base text-foreground placeholder:text-[#aaa] outline-none"
      />
      {input && (
        <button
          type="button"
          onClick={() => {
            setInput('');
            lastSent.current = '';
            onSearch('');
          }}
          aria-label="Clear search"
          className="shrink-0 w-3.5 h-3.5 flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="1" y1="1" x2="13" y2="13" stroke="black" strokeWidth="0.5" />
            <line x1="13" y1="1" x2="1" y2="13" stroke="black" strokeWidth="0.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
