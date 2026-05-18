import { API_BASE_URL, API_KEY, API_TIMEOUT_MS } from './constants';
import { Product, ProductDetail } from './types';
import fallbackProducts from './fallback/products.json';
import fallbackProductDetails from './fallback/product-details.json';

const headers: HeadersInit = {
  'x-api-key': API_KEY,
};

const localProducts = fallbackProducts as Product[];
const localProductDetails = fallbackProductDetails as unknown as Record<string, ProductDetail>;

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getLocalProducts(search?: string): Product[] {
  if (!search?.trim()) {
    return localProducts;
  }

  const normalizedSearch = normalizeText(search.trim());

  return localProducts.filter((product) => {
    const name = normalizeText(product.name);
    const brand = normalizeText(product.brand);
    return name.includes(normalizedSearch) || brand.includes(normalizedSearch);
  });
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeout);
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getProducts(search?: string): Promise<Product[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';

  try {
    return await apiFetch<Product[]>(`/products${query}`);
  } catch {
    return getLocalProducts(search);
  }
}

export async function getProductById(id: string): Promise<ProductDetail> {
  try {
    return await apiFetch<ProductDetail>(`/products/${encodeURIComponent(id)}`);
  } catch {
    const localDetail = localProductDetails[id];

    if (localDetail) {
      return localDetail;
    }

    throw new Error(`Product not found in fallback snapshot: ${id}`);
  }
}
