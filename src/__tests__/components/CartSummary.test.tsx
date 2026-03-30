import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CartSummary from '@/components/cart/CartSummary';

describe('CartSummary', () => {
  it('renders total price', () => {
    render(<CartSummary totalPrice={1199} />);
    const prices = screen.getAllByText('1199 EUR');
    expect(prices.length).toBeGreaterThanOrEqual(1);
  });

  it('renders continue shopping link', () => {
    render(<CartSummary totalPrice={0} />);
    const links = screen.getAllByRole('link', { name: /continue shopping/i });
    expect(links[0]).toHaveAttribute('href', '/');
  });

  it('renders pay button', () => {
    render(<CartSummary totalPrice={1199} />);
    const buttons = screen.getAllByRole('button', { name: /pay/i });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
