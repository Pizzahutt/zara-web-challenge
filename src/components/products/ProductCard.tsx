import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col gap-6 border-r-[0.5px] border-b-[0.5px] border-black overflow-hidden p-4 aspect-square"
      aria-label={`${product.brand} ${product.name}, ${product.basePrice} EUR`}
    >
      {/* Hover overlay — height + opacity animate together (matches Figma Smart Animate) */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-black opacity-0 transition-all duration-500 ease-out group-hover:h-full group-hover:opacity-100 z-0"
        aria-hidden="true"
      />

      <div className="relative flex-1 min-h-0 z-10">
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain"
          priority={priority}
        />
      </div>
      <div className="relative z-10 flex items-end gap-2 whitespace-nowrap font-light transition-colors duration-500">
        <div className="flex flex-1 flex-col gap-1 min-w-0 uppercase">
          <span className="truncate text-[10px] text-text-secondary group-hover:text-white/70 transition-colors duration-500">{product.brand}</span>
          <span className="truncate text-xs text-foreground group-hover:text-white transition-colors duration-500">{product.name}</span>
        </div>
        <span className="text-xs text-foreground group-hover:text-white transition-colors duration-500 shrink-0">{product.basePrice} EUR</span>
      </div>
    </Link>
  );
}
