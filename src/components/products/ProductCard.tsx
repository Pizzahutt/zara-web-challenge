import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col gap-6 border-[0.5px] border-foreground overflow-hidden p-4 aspect-square"
      aria-label={`${product.brand} ${product.name}, ${product.basePrice} EUR`}
    >
      <div className="relative flex-1 min-h-0">
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain"
        />
      </div>
      <div className="flex items-end gap-2 whitespace-nowrap font-light">
        <div className="flex flex-1 flex-col gap-1 min-w-0 uppercase">
          <span className="truncate text-xs text-text-secondary">{product.brand}</span>
          <span className="truncate text-sm text-foreground">{product.name}</span>
        </div>
        <span className="text-sm text-foreground shrink-0">{product.basePrice} EUR</span>
      </div>
    </Link>
  );
}
