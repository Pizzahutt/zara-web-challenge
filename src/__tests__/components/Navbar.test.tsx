import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '@/components/layout/Navbar';

// Mock next/navigation
const mockPathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

// Mock cart context
const mockGetTotalItems = vi.fn(() => 0);
vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    getTotalItems: mockGetTotalItems,
    getTotalPrice: vi.fn(() => 0),
  }),
}));

describe('Navbar', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
    mockGetTotalItems.mockReturnValue(0);
  });

  it('renders the MBST logo linking to home', () => {
    render(<Navbar />);
    const homeLink = screen.getByLabelText('MBST home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(screen.getByText('MBST')).toBeInTheDocument();
  });

  it('renders the bag icon with item count on non-cart pages', () => {
    mockGetTotalItems.mockReturnValue(3);
    render(<Navbar />);
    const bagLink = screen.getByLabelText('Shopping bag, 3 items');
    expect(bagLink).toBeInTheDocument();
    expect(bagLink).toHaveAttribute('href', '/cart');
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows 0 when cart is empty', () => {
    render(<Navbar />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('hides the bag icon on the cart page', () => {
    mockPathname.mockReturnValue('/cart');
    render(<Navbar />);
    expect(screen.queryByLabelText(/Shopping bag/)).not.toBeInTheDocument();
  });
});
