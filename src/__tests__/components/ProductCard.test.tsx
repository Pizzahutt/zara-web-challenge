import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';

const mockProduct: Product = {
  id: 'APL-IP15P',
  brand: 'Apple',
  name: 'iPhone 15 Pro',
  basePrice: 1219,
  imageUrl: 'http://example.com/iphone.webp',
};

describe('ProductCard', () => {
  it('renders product info', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('1219 EUR')).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/APL-IP15P');
  });

  it('renders product image with alt text', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText('Apple iPhone 15 Pro');
    expect(img).toBeInTheDocument();
  });
});
