import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API_BASE_URL = 'https://prueba-tecnica-api-tienda-moviles.onrender.com';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? '87909682e6cd74208f41a6ef39fe4191';
const OUTPUT_DIR = path.resolve(process.cwd(), 'src/lib/fallback');

async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed ${endpoint}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const products = await fetchJson('/products');
  const detailsEntries = await Promise.all(
    products.map(async (product) => {
      try {
        const detail = await fetchJson(`/products/${encodeURIComponent(product.id)}`);
        return [product.id, detail];
      } catch {
        return null;
      }
    }),
  );

  const details = Object.fromEntries(detailsEntries.filter(Boolean));

  await writeFile(
    path.join(OUTPUT_DIR, 'products.json'),
    `${JSON.stringify(products, null, 2)}\n`,
    'utf8',
  );
  await writeFile(
    path.join(OUTPUT_DIR, 'product-details.json'),
    `${JSON.stringify(details, null, 2)}\n`,
    'utf8',
  );

  // eslint-disable-next-line no-console
  console.log(`Fallback snapshot updated. products=${products.length}, details=${Object.keys(details).length}`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
