import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/api';
import type { ProductDetail } from '@/lib/types';

export function useProduct(id: string) {
  return useQuery<ProductDetail>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}
