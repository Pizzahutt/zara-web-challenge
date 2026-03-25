'use client';

import { useState, useCallback } from 'react';
import SearchBar from '@/components/products/SearchBar';
import ProductGrid from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { PRODUCTS_HOME_LIMIT } from '@/lib/constants';

export default function Home() {
  const [search, setSearch] = useState('');
  const { data: products, isLoading } = useProducts(search || undefined);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
  }, []);

  const isSearching = search.length > 0;
  const displayProducts = products
    ? isSearching
      ? products
      : products.slice(0, PRODUCTS_HOME_LIMIT)
    : [];

  return (
    <div className="flex flex-col gap-3 pb-12">
      {/* Search wrapper */}
      <div className="flex flex-col gap-3 px-4 md:px-page py-3">
        <SearchBar onSearch={handleSearch} />
        <p className="text-sm font-light uppercase">
          {isLoading ? '\u00A0' : `${displayProducts.length} results`}
        </p>
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-4 md:px-page">
          {Array.from({ length: PRODUCTS_HOME_LIMIT }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border-[0.5px] border-foreground/20 animate-pulse bg-gray-50"
            />
          ))}
        </div>
      ) : (
        <ProductGrid products={displayProducts} />
      )}
    </div>
  );
}
