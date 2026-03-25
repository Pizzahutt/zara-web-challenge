import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColorSelector from '@/components/detail/ColorSelector';
import type { ColorOption } from '@/lib/types';

const mockOptions: ColorOption[] = [
  { name: 'Titanium Black', hexCode: '#62605f', imageUrl: '/img1.webp' },
  { name: 'Titanium Gray', hexCode: '#4d4e5f', imageUrl: '/img2.webp' },
  { name: 'Titanium Gold', hexCode: '#f0e1b9', imageUrl: '/img3.webp' },
];

describe('ColorSelector', () => {
  it('renders color swatches for all options', () => {
    render(
      <ColorSelector options={mockOptions} selected={null} onSelect={() => {}} />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('shows selected color name', () => {
    render(
      <ColorSelector
        options={mockOptions}
        selected="Titanium Black"
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText('Titanium Black')).toBeInTheDocument();
    const selected = screen.getByRole('radio', { name: 'Titanium Black' });
    expect(selected).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onSelect when a swatch is clicked', () => {
    const onSelect = vi.fn();
    render(
      <ColorSelector options={mockOptions} selected={null} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Titanium Gold' }));
    expect(onSelect).toHaveBeenCalledWith('Titanium Gold');
  });
});
