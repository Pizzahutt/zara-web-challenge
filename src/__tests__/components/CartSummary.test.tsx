import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CartSummary from '@/components/cart/CartSummary';

describe('CartSummary', () => {
  it('renders total price', () => {
    render(<CartSummary totalPrice={1199} />);
    expect(screen.getByText('1199 EUR')).toBeInTheDocument();
  });

  it('renders continue shopping link', () => {
    render(<CartSummary totalPrice={0} />);
    const link = screen.getByRole('link', { name: /continue shopping/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders pay button', () => {
    render(<CartSummary totalPrice={1199} />);
    expect(screen.getByRole('button', { name: /pay/i })).toBeInTheDocument();
  });
});
