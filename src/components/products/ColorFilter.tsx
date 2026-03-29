'use client';

import type { ColorInfo } from '@/hooks/useProductColors';

interface ColorFilterProps {
  colors: ColorInfo[];
  selectedColor: string | null;
  onSelectColor: (hex: string | null) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ColorFilter({
  colors,
  selectedColor,
  onSelectColor,
  isOpen,
  onToggle,
}: ColorFilterProps) {
  const handleColorClick = (hex: string) => {
    onSelectColor(selectedColor === hex ? null : hex);
  };

  const selectedName = colors.find((c) => c.hexCode === selectedColor)?.name;

  return (
    <div className="md:hidden flex items-center justify-end gap-6">
      <div
        className={`relative flex items-center gap-4 transition-opacity duration-200 ${
          isOpen && colors.length > 0
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {(colors.length > 0
          ? colors
          : (Array.from({ length: 5 }) as (ColorInfo | undefined)[])
        ).map((color, i) =>
          color ? (
            <button
              key={color.hexCode}
              onClick={() => handleColorClick(color.hexCode)}
              aria-label={color.name}
              className={`size-6 border flex items-center justify-center ${
                selectedColor === color.hexCode
                  ? 'border-black'
                  : 'border-[#ccc]'
              }`}
            >
              <div
                className="size-5"
                style={{ backgroundColor: color.hexCode }}
              />
            </button>
          ) : (
            <div key={i} className="size-6" />
          ),
        )}
        <span
          className={`absolute left-0 top-[34px] text-[10px] font-light whitespace-nowrap transition-opacity duration-300 ${
            selectedName ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {selectedName ?? '\u00A0'}
        </span>
      </div>
      <button
        onClick={onToggle}
        className="font-light text-[12px] uppercase tracking-[0.96px]"
      >
        {isOpen ? 'Cerrar' : 'Filtrar'}
      </button>
    </div>
  );
}
