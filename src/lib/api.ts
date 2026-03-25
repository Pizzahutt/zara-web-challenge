import { API_BASE_URL, API_KEY } from './constants';
import { Product, ProductDetail } from './types';

const headers: HeadersInit = {
  'x-api-key': API_KEY,
};

async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getProducts(search?: string): Promise<Product[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiFetch<Product[]>(`/products${query}`);
}

export async function getProductById(id: string): Promise<ProductDetail> {
  return apiFetch<ProductDetail>(`/products/${encodeURIComponent(id)}`);
}
