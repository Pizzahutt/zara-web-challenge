/**
 * Fallback smoke tests — run against the live Vercel demo with the API
 * endpoints deliberately blocked (abort) to prove the app falls back to
 * the local snapshot and remains fully usable.
 */
import { test, expect } from '@playwright/test';

const PROD_URL = 'https://zara-web-challenge-peach.vercel.app';
const API_ORIGIN = 'https://prueba-tecnica-api-tienda-moviles.onrender.com';

test.describe('Fallback snapshot — API offline simulation', () => {
  test.beforeEach(async ({ page }) => {
    // Block every request to the remote API so the app is forced to use the
    // bundled fallback data that was baked into the build.
    await page.route(`${API_ORIGIN}/**`, (route) => route.abort('failed'));
  });

  test('home page shows products even when API is unreachable', async ({ page }) => {
    await page.goto(PROD_URL);

    // Products must appear within a reasonable timeout
    await page.waitForSelector('a[href^="/product/"]', { timeout: 20000 });

    const count = await page.locator('a[href^="/product/"]').count();
    expect(count).toBeGreaterThanOrEqual(1);

    console.log(`✓ [fallback] ${count} products rendered without API`);
  });

  test('result count indicator is rendered (not blank)', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForSelector('a[href^="/product/"]', { timeout: 20000 });

    const status = page.locator('[role="status"]');
    await status.waitFor({ state: 'visible', timeout: 5000 });
    const text = await status.textContent();

    // Should contain a number followed by "results"
    expect(text).toMatch(/\d+\s+results/i);
    console.log(`✓ [fallback] result counter: "${text?.trim()}"`);
  });

  test('search works against fallback data', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForSelector('a[href^="/product/"]', { timeout: 20000 });

    const input = page.locator('input[type="text"], input[type="search"]').first();
    await input.fill('iphone');

    // Wait for debounce + re-render
    await page.waitForTimeout(700);

    const cards = page.locator('a[href^="/product/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Every visible product name/brand should be Apple / iPhone
    const names = await page.locator('a[href^="/product/"]').allTextContents();
    const allMatch = names.every((n) => /iphone|apple/i.test(n));
    expect(allMatch).toBe(true);

    console.log(`✓ [fallback] search "iphone" → ${count} results, all match`);
  });

  test('product detail page loads from fallback data', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.locator('a[href^="/product/"]').first().waitFor({ state: 'visible', timeout: 20000 });

    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForURL(/\/product\/.+/);

    // Storage and color selectors must be present
    const storageGroup = page.getByRole('radiogroup', { name: /storage/i });
    await storageGroup.waitFor({ state: 'visible', timeout: 15000 });
    const storageOptions = storageGroup.getByRole('radio');
    expect(await storageOptions.count()).toBeGreaterThan(0);

    const colorGroup = page.getByRole('radiogroup', { name: /color/i });
    await colorGroup.waitFor({ state: 'visible', timeout: 5000 });
    expect(await colorGroup.getByRole('radio').count()).toBeGreaterThan(0);

    // Add-to-cart button must exist
    const addButton = page.getByRole('button', { name: /añadir|add/i });
    await expect(addButton).toBeVisible();

    console.log('✓ [fallback] product detail rendered with selectors');
  });

  test('full purchase flow works without API', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.locator('a[href^="/product/"]').first().waitFor({ state: 'visible', timeout: 20000 });

    // Navigate to first product
    await page.locator('a[href^="/product/"]').first().click();
    await page.waitForURL(/\/product\/.+/);

    // Select storage
    const storageGroup = page.getByRole('radiogroup', { name: /storage/i });
    await storageGroup.waitFor({ state: 'visible', timeout: 15000 });
    await storageGroup.getByRole('radio').first().click();

    // Select color
    const colorGroup = page.getByRole('radiogroup', { name: /color/i });
    await colorGroup.getByRole('radio').first().click();

    // Add to cart
    const addButton = page.getByRole('button', { name: /añadir|add/i });
    await expect(addButton).toBeEnabled();
    await addButton.click();

    // Verify cart
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
