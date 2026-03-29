import { useState, useEffect, useRef } from 'react';
import { getProductById } from '@/lib/api';
import type { Product, ProductDetail } from '@/lib/types';

export interface ColorInfo {
  hexCode: string;
  name: string;
  count: number;
}

interface ColorData {
  topColors: ColorInfo[];
  productColorMap: Map<string, Set<string>>;
  colorImageMap: Map<string, Map<string, string>>;
}

const EMPTY: ColorData = {
  topColors: [],
  productColorMap: new Map(),
  colorImageMap: new Map(),
};

function buildColorData(details: ProductDetail[]): ColorData {
  const colorCount: Record<string, { name: string; count: number }> = {};
  const productColorMap = new Map<string, Set<string>>();
  const colorImageMap = new Map<string, Map<string, string>>();

  details.forEach((d) => {
    const hexes = new Set<string>();
    const imgMap = new Map<string, string>();

    d.colorOptions.forEach((c) => {
      const hex = c.hexCode.toUpperCase();
      hexes.add(hex);
      imgMap.set(hex, c.imageUrl);
      if (!colorCount[hex]) {
        colorCount[hex] = { name: c.name, count: 0 };
      }
      colorCount[hex].count++;
    });

    productColorMap.set(d.id, hexes);
    colorImageMap.set(d.id, imgMap);
  });

  const topColors = Object.entries(colorCount)
    .map(([hex, { name, count }]) => ({ hexCode: hex, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return { topColors, productColorMap, colorImageMap };
}

/**
 * Lazy hook: only fetches product details when `enabled` is true (filter opened).
 * Caches results so re-opening the filter is instant.
 */
export function useProductColors(products: Product[], enabled: boolean) {
  const [data, setData] = useState<ColorData>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef(new Map<string, ProductDetail>());

  useEffect(() => {
    if (!enabled || products.length === 0) return;

    let cancelled = false;
    const cache = cacheRef.current;

    async function fetchAll() {
      setIsLoading(true);

      const uncached = products.filter((p) => !cache.has(p.id));

      if (uncached.length > 0) {
        const results = await Promise.allSettled(
          uncached.map((p) => getProductById(p.id)),
        );
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            cache.set(uncached[i].id, r.value);
          }
        });
      }

      if (cancelled) return;

      const details = products
        .map((p) => cache.get(p.id))
        .filter((d): d is ProductDetail => !!d);

      setData(buildColorData(details));
      setIsLoading(false);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [enabled, products]);

  return { ...data, isLoading };
}
