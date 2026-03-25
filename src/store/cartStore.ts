import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/lib/types';

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const id = `${item.productId}-${item.color}-${item.storage}`;
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, id, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      getTotalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' },
  ),
);
