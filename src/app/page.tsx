'use client';

import { useState, useCallback } from 'react';
import SearchBar from '@/components/products/SearchBar';
import ColorFilter from '@/components/products/ColorFilter';
import ProductGrid from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { useProductColors } from '@/hooks/useProductColors';
import { PRODUCTS_HOME_LIMIT } from '@/lib/constants';

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: products, isLoading, error } = useProducts(search || undefined);
  const { topColors, productColorMap, colorImageMap } = useProductColors(
    products ?? [],
    filterOpen,
  );

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
  }, []);

  const handleToggleFilter = useCallback(() => {
    setFilterOpen((prev) => {
      if (prev) setSelectedColor(null);
      return !prev;
    });
  }, []);

  const isSearching = search.length > 0;
  const uniqueProducts = products
    ? Array.from(new Map(products.map((p) => [p.id, p])).values())
    : [];
  const baseProducts = isSearching
    ? uniqueProducts
    : uniqueProducts.slice(0, PRODUCTS_HOME_LIMIT);

  const displayProducts = selectedColor
    ? baseProducts
        .filter((p) => productColorMap.get(p.id)?.has(selectedColor))
        .map((p) => {
          const colorImg = colorImageMap.get(p.id)?.get(selectedColor);
          return colorImg ? { ...p, imageUrl: colorImg } : p;
        })
    : baseProducts;

  return (
    <div className="flex flex-col gap-3 pb-12">
      {/* Search wrapper */}
      <div className="flex flex-col gap-3 px-4 md:px-page py-3 pb-8">
        <SearchBar onSearch={handleSearch} />
        <div className="flex items-center justify-between">
          <p className="text-sm font-light uppercase" role="status" aria-live="polite">
            {isLoading ? '\u00A0' : `${displayProducts.length} results`}
          </p>
          <ColorFilter
            colors={topColors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            isOpen={filterOpen}
            onToggle={handleToggleFilter}
          />
        </div>
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-4 md:px-page" aria-busy="true" aria-label="Loading products">
          {Array.from({ length: PRODUCTS_HOME_LIMIT }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border-[0.5px] border-foreground/20 animate-pulse bg-gray-50"
            />
          ))}
        </div>
      ) : error ? (
        <p className="px-4 md:px-page py-12 text-sm font-light text-text-secondary">
          Something went wrong. Please try again later.
        </p>
      ) : (
        <ProductGrid products={displayProducts} />
      )}
    </div>
  );
}
