import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';

interface SimilarProductsProps {
  products: Product[];
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-10">
      <h2 className="font-light text-xl capitalize">Similar Items</h2>
      <div className="flex overflow-x-auto scrollbar-hide -mx-4 md:mx-0">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="shrink-0 flex flex-col gap-6 border-[0.5px] border-black overflow-hidden p-4 w-[200px] h-[200px] md:w-[344px] md:h-[344px]"
            aria-label={`${product.brand} ${product.name}, ${product.basePrice} EUR`}
          >
            <div className="relative flex-1 min-h-0">
              <Image
                src={product.imageUrl}
                alt={`${product.brand} ${product.name}`}
                fill
                sizes="(max-width: 768px) 200px, 344px"
                className="object-contain"
              />
            </div>
            <div className="flex items-end gap-2 whitespace-nowrap font-light">
              <div className="flex flex-1 flex-col gap-1 min-w-0 uppercase">
                <span className="truncate text-xs text-text-secondary">
                  {product.brand}
                </span>
                <span className="truncate text-sm text-foreground">
                  {product.name}
                </span>
              </div>
              <span className="text-sm text-foreground shrink-0 capitalize">
                {product.basePrice} EUR
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
