import { test, expect } from '@playwright/test';

async function getGridColumnCount(page: import('@playwright/test').Page) {
  await page.goto('/');
  const firstCard = page.locator('a[href^="/product/"]').first();
  await firstCard.waitFor({ state: 'visible', timeout: 15000 });

  // Wait for several cards to render (they animate in with staggered delay)
  await page.locator('a[href^="/product/"]').nth(5).waitFor({ state: 'attached', timeout: 10000 });
  // Allow animations to settle
  await page.waitForTimeout(500);

  // The grid uses flex-wrap with percentage widths (w-1/2 on mobile, w-1/5 on desktop).
  // Count how many cards share the same top offset = number of columns in first row.
  const columns = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href^="/product/"]'));
    if (cards.length === 0) return 0;
    const firstTop = cards[0].getBoundingClientRect().top;
    return cards.filter((c) => Math.abs(c.getBoundingClientRect().top - firstTop) < 2).length;
  });
  return columns;
}

test.describe('Product Grid responsive layout', () => {
  test('grid columns match viewport', async ({ page }, testInfo) => {
    const columnCount = await getGridColumnCount(page);

    if (testInfo.project.name === 'mobile') {
      // At 390px viewport, cards are w-full (1 column). sm:w-1/2 kicks in at 640px+.
      expect(columnCount).toBe(1);
    } else {
      expect(columnCount).toBe(5);
    }
  });
});
