import type { Metadata } from 'next';
import { getProductById } from '@/lib/api';
import ProductDetailClient from '@/components/detail/ProductDetailClient';

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);
    return {
      title: `${product.name} — MBST`,
      description: `${product.brand} ${product.name}. ${product.description}`,
    };
  } catch {
    return { title: 'Product — MBST' };
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailClient id={params.id} />;
}
