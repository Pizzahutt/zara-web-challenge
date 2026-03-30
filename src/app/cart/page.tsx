'use client';

import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useHydrated } from '@/hooks/useHydrated';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, getTotalItems, getTotalPrice } = useCart();
  const hydrated = useHydrated();

  const totalItems = hydrated ? getTotalItems() : 0;
  const totalPrice = hydrated ? getTotalPrice() : 0;
  const displayItems = hydrated ? items : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Separator line below header — hidden on mobile per Figma prototype */}
      <div className="hidden md:block h-px bg-black" />

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
            {displayItems.map((item) => (
              <CartItem key={item.id} item={item} onRemove={removeItem} />
            ))}
          </div>
          <CartSummary totalPrice={totalPrice} />
        </>
      )}
    </motion.div>
  );
}
