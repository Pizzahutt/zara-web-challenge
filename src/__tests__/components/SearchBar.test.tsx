import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchBar from '@/components/products/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the search input with placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search for a smartphone...')).toBeInTheDocument();
  });

  it('calls onSearch with debounced value', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'samsung' } });
    });

    // Should not fire immediately
    expect(onSearch).not.toHaveBeenCalledWith('samsung');

    // After debounce delay
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(onSearch).toHaveBeenCalledWith('samsung');
  });

  it('has accessible label', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByLabelText('Search for a smartphone')).toBeInTheDocument();
  });
});
