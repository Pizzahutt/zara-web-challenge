'use client';

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/lib/types';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <article className="flex gap-6 md:gap-10" aria-label={`${item.name}, ${item.color}, ${item.storage}`}>
      <div className="relative w-[120px] h-[148px] md:w-[262px] md:h-[324px] shrink-0">
        <Image
          src={item.imageUrl}
          alt={`${item.brand} ${item.name}`}
          fill
          sizes="(max-width: 768px) 120px, 262px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between py-4 md:py-10 font-light text-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 uppercase">
            <span className="truncate">{item.name}</span>
            <span className="truncate whitespace-pre">
              {item.storage}  | {item.color}
            </span>
          </div>
          <span className="capitalize">{item.price} EUR</span>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="text-[#df0000] text-left text-sm font-light"
          aria-label={`Remove ${item.name} from cart`}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
