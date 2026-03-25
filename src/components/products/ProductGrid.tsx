import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="px-4 md:px-page py-12 text-sm font-light uppercase text-text-secondary">
        No results found
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-4 md:px-page">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 5} />
      ))}
    </div>
  );
}
