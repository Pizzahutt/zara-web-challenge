import { afterEach, describe, expect, it, vi } from 'vitest';
import fallbackProducts from '@/lib/fallback/products.json';
import fallbackDetails from '@/lib/fallback/product-details.json';
import { getProductById, getProducts } from '@/lib/api';

describe('api fallback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns local products when remote /products fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const products = await getProducts();

    expect(products).toEqual(fallbackProducts);
  });

  it('filters local products by search when remote /products fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const products = await getProducts('iphone');

    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => /iphone|apple/i.test(`${p.name} ${p.brand}`))).toBe(true);
  });

  it('returns local product detail when remote /products/:id fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const firstProductId = fallbackProducts[0]?.id as string;
    const expectedDetail = (fallbackDetails as Record<string, unknown>)[firstProductId];
    const detail = await getProductById(firstProductId);

    expect(detail).toEqual(expectedDetail);
  });
});
