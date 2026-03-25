'use client';

import { createContext, useContext } from 'react';
import { useCartStore, type CartState } from '@/store/cartStore';

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const store = useCartStore();
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
