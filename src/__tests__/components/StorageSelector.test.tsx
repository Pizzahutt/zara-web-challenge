import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StorageSelector from '@/components/detail/StorageSelector';
import type { StorageOption } from '@/lib/types';

const mockOptions: StorageOption[] = [
  { capacity: '256 GB', price: 1099 },
  { capacity: '512 GB', price: 1199 },
  { capacity: '1 TB', price: 1399 },
];

describe('StorageSelector', () => {
  it('renders all storage options', () => {
    render(
      <StorageSelector options={mockOptions} selected={null} onSelect={() => {}} />,
    );
    expect(screen.getByText('256 GB')).toBeInTheDocument();
    expect(screen.getByText('512 GB')).toBeInTheDocument();
    expect(screen.getByText('1 TB')).toBeInTheDocument();
  });

  it('marks selected option as pressed', () => {
    render(
      <StorageSelector options={mockOptions} selected="512 GB" onSelect={() => {}} />,
    );
    const selected = screen.getByLabelText('512 GB, 1199 EUR');
    expect(selected).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onSelect when an option is clicked', () => {
    const onSelect = vi.fn();
    render(
      <StorageSelector options={mockOptions} selected={null} onSelect={onSelect} />,
    );
    fireEvent.click(screen.getByText('1 TB'));
    expect(onSelect).toHaveBeenCalledWith('1 TB');
  });
});
