'use client';

import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, getTotalItems, getTotalPrice } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div>
      {/* Separator line below header */}
      <div className="h-px bg-black" />

      <div className="px-4 md:px-page py-6 md:py-12">
        <h1 className="font-light text-2xl uppercase">
          Cart ({totalItems})
        </h1>
      </div>

      {totalItems === 0 ? (
        <div className="px-4 md:px-page py-20 text-center">
          <p className="font-light text-lg mb-8">Your cart is empty</p>
          <Link
            href="/"
            className="border-[0.5px] border-[#1b1a18] h-14 px-8 py-5 font-light text-sm uppercase tracking-[0.96px] inline-flex items-center"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="px-4 md:px-page flex flex-col gap-8 pb-40 md:pb-44">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onRemove={removeItem} />
            ))}
          </div>
          <CartSummary totalPrice={totalPrice} />
        </>
      )}
    </div>
  );
}
