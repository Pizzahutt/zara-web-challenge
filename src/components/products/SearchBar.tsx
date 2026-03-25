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
    <div className="border-b-[0.5px] border-foreground pb-2">
      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a smartphone..."
        aria-label="Search for a smartphone"
        className="w-full bg-transparent font-light text-base text-foreground placeholder:text-[#aaa] outline-none"
      />
    </div>
  );
}
