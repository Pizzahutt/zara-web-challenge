'use client';

import { useState } from 'react';
import type { ColorOption } from '@/lib/types';

interface ColorSelectorProps {
  options: ColorOption[];
  selected: string | null;
  onSelect: (colorName: string) => void;
}

export default function ColorSelector({
  options,
  selected,
  onSelect,
}: ColorSelectorProps) {
  const selectedOption = options.find((o) => o.name === selected);
  const [hovered, setHovered] = useState<string | null>(null);

  const displayName = hovered ?? selectedOption?.name ?? null;

  return (
    <div className="flex flex-col gap-6">
      <p className="font-light text-sm uppercase">
        Color. Pick your favourite.
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 items-center" role="radiogroup" aria-label="Color options">
          {options.map((option) => {
            const isSelected = selected === option.name;
            return (
              <button
                key={option.name}
                onClick={() => onSelect(option.name)}
                onMouseEnter={() => setHovered(option.name)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center justify-center size-6 border ${
                  isSelected ? 'border-black' : 'border-[#ccc]'
                }`}
                role="radio"
                aria-checked={isSelected}
                aria-label={option.name}
              >
                <div
                  className="size-5"
                  style={{ backgroundColor: option.hexCode }}
                />
              </button>
            );
          })}
        </div>
        <span
          className={`font-light text-[12px] transition-opacity duration-300 ${
            displayName ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {displayName || '\u00A0'}
        </span>
      </div>
    </div>
  );
}
