import { test, expect } from '@playwright/test';

const PROD_URL = 'https://zara-web-challenge-peach.vercel.app';

test.describe('Production smoke tests', () => {
  test('home page loads and shows products', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForSelector('a[href^="/product/"]', { timeout: 15000 });

    const productCards = page.locator('a[href^="/product/"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    console.log(`✓ Found ${count} products on home page`);
  });

  test('product detail page loads', async ({ page }) => {
    await page.goto(PROD_URL);
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await firstProduct.waitFor({ state: 'visible', timeout: 15000 });
    await firstProduct.click();

    await page.waitForURL(/\/product\/.+/);
    // Should show add to cart button
    const addButton = page.locator('button', { hasText: /AÑADIR|ADD/i });
    await addButton.waitFor({ state: 'visible', timeout: 10000 });
    expect(await addButton.isVisible()).toBe(true);
    console.log('✓ Product detail page loaded with add-to-cart button');
  });

  test('cart page loads', async ({ page }) => {
    await page.goto(`${PROD_URL}/cart`);
    const heading = page.locator('h1');
    await heading.waitFor({ state: 'visible', timeout: 10000 });
    expect(await heading.textContent()).toContain('Cart');
    console.log('✓ Cart page loaded');
  });

  test('search filters products', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForSelector('a[href^="/product/"]', { timeout: 15000 });

    const input = page.locator('input[type="text"], input[type="search"]').first();
    await input.fill('iphone');
    // Wait for debounce + API response
    await page.waitForTimeout(1000);

    const cards = page.locator('a[href^="/product/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    console.log(`✓ Search returned ${count} results for "iphone"`);
  });
});
