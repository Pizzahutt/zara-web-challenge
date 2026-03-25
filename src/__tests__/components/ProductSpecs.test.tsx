import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductSpecs from '@/components/detail/ProductSpecs';
import type { ProductSpecs as ProductSpecsType } from '@/lib/types';

const mockSpecs: ProductSpecsType = {
  screen: '6.8" Dynamic AMOLED 2X',
  resolution: '3120 x 1440 pixels',
  processor: 'Snapdragon 8 Gen 3',
  mainCamera: '200 MP',
  selfieCamera: '12 MP',
  battery: '5000 mAh',
  os: 'Android 14',
  screenRefreshRate: '120 Hz',
};

describe('ProductSpecs', () => {
  it('renders spec rows with labels and values', () => {
    render(
      <ProductSpecs
        specs={mockSpecs}
        brand="Samsung"
        name="Galaxy S24 Ultra"
        description="A premium phone"
      />,
    );
    expect(screen.getByText('Samsung')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    expect(screen.getByText('A premium phone')).toBeInTheDocument();
    expect(screen.getByText('6.8" Dynamic AMOLED 2X')).toBeInTheDocument();
    expect(screen.getByText('120 Hz')).toBeInTheDocument();
  });

  it('renders the section heading', () => {
    render(
      <ProductSpecs
        specs={mockSpecs}
        brand="Samsung"
        name="Galaxy S24 Ultra"
        description="desc"
      />,
    );
    expect(screen.getByRole('heading', { name: /specifications/i })).toBeInTheDocument();
  });
});
