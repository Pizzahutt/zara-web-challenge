import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartItem from '@/components/cart/CartItem';
import type { CartItem as CartItemType } from '@/lib/types';

const mockItem: CartItemType = {
  id: 'SMG-S24U-Titanium Black-512 GB',
  productId: 'SMG-S24U',
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  imageUrl: 'http://example.com/s24.webp',
  color: 'Titanium Black',
  storage: '512 GB',
  price: 1199,
  quantity: 1,
};

describe('CartItem', () => {
  it('renders item details', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} />);
    expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    expect(screen.getByText(/512 GB.*Titanium Black/)).toBeInTheDocument();
    expect(screen.getByText('1199 EUR')).toBeInTheDocument();
  });

  it('renders delete button with red text', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} />);
    const btn = screen.getByRole('button', { name: /remove/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Eliminar');
  });

  it('calls onRemove with item id when delete is clicked', () => {
    const onRemove = vi.fn();
    render(<CartItem item={mockItem} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(onRemove).toHaveBeenCalledWith('SMG-S24U-Titanium Black-512 GB');
  });

  it('renders product image', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} />);
    const img = screen.getByAltText('Samsung Galaxy S24 Ultra');
    expect(img).toBeInTheDocument();
  });
});
