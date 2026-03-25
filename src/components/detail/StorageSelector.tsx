'use client';

import type { StorageOption } from '@/lib/types';

interface StorageSelectorProps {
  options: StorageOption[];
  selected: string | null;
  onSelect: (capacity: string) => void;
}

export default function StorageSelector({
  options,
  selected,
  onSelect,
}: StorageSelectorProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-light text-sm uppercase">
        Storage. <span className="normal-case">¿How much space do you need?</span>
      </p>
      <div className="flex flex-wrap">
        {options.map((option, index) => {
          const isSelected = selected === option.capacity;
          return (
            <button
              key={option.capacity}
              onClick={() => onSelect(option.capacity)}
              className={`px-6 py-6 font-light text-sm capitalize whitespace-nowrap ${
                isSelected
                  ? 'border border-black'
                  : index === 0
                    ? 'border border-[#ccc]'
                    : 'border-t border-b border-r border-[#ccc]'
              }`}
              aria-pressed={isSelected}
              aria-label={`${option.capacity}, ${option.price} EUR`}
            >
              {option.capacity}
            </button>
          );
        })}
      </div>
    </div>
  );
}
