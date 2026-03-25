import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

export function useProducts(search?: string) {
  return useQuery<Product[]>({
    queryKey: ['products', search ?? ''],
    queryFn: () => getProducts(search),
  });
}
