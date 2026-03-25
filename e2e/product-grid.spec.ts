import { test, expect } from '@playwright/test';

async function getGridColumnCount(page: import('@playwright/test').Page) {
  await page.goto('/');
  const grid = page.locator('.grid').first();
  await grid.waitFor({ state: 'visible' });
  const firstCard = grid.locator('a').first();
  await firstCard.waitFor({ state: 'visible' });

  const columns = await grid.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.gridTemplateColumns;
  });
  return columns.split(' ').filter((c) => c.trim()).length;
}

test.describe('Product Grid responsive layout', () => {
  test('grid columns match viewport', async ({ page }, testInfo) => {
    const columnCount = await getGridColumnCount(page);

    if (testInfo.project.name === 'mobile') {
      expect(columnCount).toBe(2);
    } else {
      expect(columnCount).toBe(5);
    }
  });
});
