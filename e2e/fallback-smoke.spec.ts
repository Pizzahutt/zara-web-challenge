/**
 * Fallback smoke tests — run against the local dev server with the API
 * intercepted client-side to simulate an offline backend.
 *
 * NOTE: The remote Vercel deployment uses SSR; network interception via
 * page.route() only affects browser-initiated requests, not server-side
 * fetches on Vercel's infrastructure. These tests run against localhost
 * where both server and client fetches can be observed.
 *
 * The fallback is also covered by unit tests in src/lib/api.fallback.test.ts.
 */
import { test, expect } from '@playwright/test';

const PROD_URL = 'https://zara-web-challenge-peach.vercel.app';
const API_ORIGIN = 'https://prueba-tecnica-api-tienda-moviles.onrender.com';
// Local dev server (started by playwright webServer config)
const LOCAL_URL = 'http://localhost:3000';

test.describe('Fallback snapshot — API offline simulation (localhost)', () => {
  test.beforeEach(async ({ page }) => {
    // Block every API request from the browser so TanStack Query triggers the
    // catch → fallback path in api.ts. Works on localhost where fetches come
    // from the browser (client components use TanStack Query).
    await page.route(`${API_ORIGIN}/**`, (route) => route.abort('failed'));
  });

  test('home page shows products even when API is unreachable', async ({ page }) => {
    await page.goto(LOCAL_URL);

    // Wait for product links to appear — fallback data kicks in after the
    // browser fetch is aborted. Generous timeout for Next.js dev cold start.
    await page.waitForSelector('a[href^="/product/"]', { timeout: 30000 });

    const count = await page.locator('a[href^="/product/"]').count();
    expect(count).toBeGreaterThanOrEqual(1);

    const status = page.locator('[role="status"]');
    await expect(status).toHaveText(/\d+\s+results/i, { timeout: 5000 });

    console.log(`✓ [fallback] ${count} products rendered without API`);
  });

  test('result count indicator is rendered (not blank)', async ({ page }) => {
    await page.goto(LOCAL_URL);
    await page.waitForSelector('a[href^="/product/"]', { timeout: 15000 });

    const status = page.locator('[role="status"]');
    await status.waitFor({ state: 'visible', timeout: 5000 });
    const text = await status.textContent();

    // Should contain a number followed by "results"
    expect(text).toMatch(/\d+\s+results/i);
    console.log(`✓ [fallback] result counter: "${text?.trim()}"`);
  });

  test('search works against fallback data', async ({ page }) => {
    await page.goto(LOCAL_URL);
    await page.waitForSelector('a[href^="/product/"]', { timeout: 15000 });

    const input = page.locator('input[type="text"], input[type="search"]').first();
    await input.fill('iphone');

    // Wait for debounce + re-render
    await page.waitForTimeout(700);

    const cards = page.locator('a[href^="/product/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    console.log(`✓ [fallback] search "iphone" → ${count} results`);
  });

  test('product detail page loads from fallback data', async ({ page }) => {
    await page.goto(LOCAL_URL);
    await page.locator('a[href^="/product/"]').first().waitFor({ state: 'visible', timeout: 15000 });

    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForURL(/\/product\/.+/);

    // Storage and color selectors must be present
    const storageGroup = page.getByRole('radiogroup', { name: /storage/i });
    await storageGroup.waitFor({ state: 'visible', timeout: 15000 });
    expect(await storageGroup.getByRole('radio').count()).toBeGreaterThan(0);

    const colorGroup = page.getByRole('radiogroup', { name: /color/i });
    await colorGroup.waitFor({ state: 'visible', timeout: 5000 });
    expect(await colorGroup.getByRole('radio').count()).toBeGreaterThan(0);

    const addButton = page.getByRole('button', { name: /añadir|add/i });
    await expect(addButton).toBeVisible();

    console.log('✓ [fallback] product detail rendered with selectors');
  });

  test('full purchase flow works without API', async ({ page }) => {
    await page.goto(LOCAL_URL);
    await page.locator('a[href^="/product/"]').first().waitFor({ state: 'visible', timeout: 15000 });

    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForURL(/\/product\/.+/);

    const storageGroup = page.getByRole('radiogroup', { name: /storage/i });
    await storageGroup.waitFor({ state: 'visible', timeout: 15000 });
    await storageGroup.getByRole('radio').first().click();

    const colorGroup = page.getByRole('radiogroup', { name: /color/i });
    await colorGroup.getByRole('radio').first().click();

    const addButton = page.getByRole('button', { name: /añadir|add/i });
    await expect(addButton).toBeEnabled();
    await addButton.click();

    await page.waitForURL('/cart');
    await expect(page.locator('h1')).toContainText('(1)');

    console.log('✓ [fallback] full purchase flow completed without API');
  });
});

test.describe('Live API smoke — sanity check (API online)', () => {
  test('home page loads products from live API or fallback', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForSelector('a[href^="/product/"]', { timeout: 20000 });
    const count = await page.locator('a[href^="/product/"]').count();
    expect(count).toBeGreaterThanOrEqual(1);
    console.log(`✓ [live] ${count} products on home page`);
  });

  test('product detail renders specs', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.locator('a[href^="/product/"]').first().waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForURL(/\/product\/.+/);

    // Specs table must be present
    const specs = page.locator('dl, table, [data-testid="specs"]').first();
    await specs.waitFor({ state: 'visible', timeout: 15000 });
    expect(await specs.isVisible()).toBe(true);
    console.log('✓ [live] specs section visible on product detail');
  });

  test('cart page renders heading', async ({ page }) => {
    await page.goto(`${PROD_URL}/cart`);
    const heading = page.locator('h1');
    await heading.waitFor({ state: 'visible', timeout: 10000 });
    expect(await heading.isVisible()).toBe(true);
    console.log('✓ [live] cart page heading visible');
  });
});
