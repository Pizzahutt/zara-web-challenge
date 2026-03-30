import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cartStore';

const sampleItem = {
  productId: 'prod-1',
  name: 'Galaxy S24',
  brand: 'Samsung',
  imageUrl: '/img.jpg',
  color: 'Black',
  storage: '256 GB',
  price: 899,
};

const anotherItem = {
  productId: 'prod-2',
  name: 'iPhone 16',
  brand: 'Apple',
  imageUrl: '/img2.jpg',
  color: 'White',
  storage: '128 GB',
  price: 999,
};

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('starts with empty cart', () => {
    const { items } = useCartStore.getState();
    expect(items).toEqual([]);
  });

  it('adds an item to the cart', () => {
    useCartStore.getState().addItem(sampleItem);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: 'prod-1-Black-256 GB',
      name: 'Galaxy S24',
      quantity: 1,
      price: 899,
    });
  });

  it('increments quantity for duplicate item', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem(sampleItem);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('treats different color/storage as separate items', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem({ ...sampleItem, color: 'White' });
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe('prod-1-Black-256 GB');
    expect(items[1].id).toBe('prod-1-White-256 GB');
  });

  it('removes an item by id', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem(anotherItem);
    useCartStore.getState().removeItem('prod-1-Black-256 GB');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('iPhone 16');
  });

  it('calculates total items with quantities', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem(anotherItem);
    expect(useCartStore.getState().getTotalItems()).toBe(3);
  });

  it('calculates total price with quantities', () => {
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem(sampleItem);
    useCartStore.getState().addItem(anotherItem);
    // 899*2 + 999*1 = 2797
    expect(useCartStore.getState().getTotalPrice()).toBe(2797);
  });

  it('returns zero totals for empty cart', () => {
    expect(useCartStore.getState().getTotalItems()).toBe(0);
    expect(useCartStore.getState().getTotalPrice()).toBe(0);
  });
});
