import { test, expect } from '@playwright/test';

test.describe('Purchase flow', () => {
  test('full flow: browse → select options → add to cart → verify cart', async ({
    page,
  }) => {
    // 1. Home — wait for products to load
    await page.goto('/');
    const productLinks = page.locator('a[href^="/product/"]');
    await productLinks.first().waitFor({ state: 'visible', timeout: 15000 });

    // 2. Click first product
    await productLinks.first().click();
    await page.waitForURL(/\/product\/.+/);

    // 3. Product detail — wait for add-to-cart button
    const addButton = page.getByRole('button', { name: /añadir|add/i });
    await addButton.waitFor({ state: 'visible', timeout: 10000 });

    // Button should be disabled before selecting options
    await expect(addButton).toBeDisabled();

    // 4. Select first storage option
    const storageGroup = page.getByRole('radiogroup', {
      name: /storage/i,
    });
    const storageOptions = storageGroup.getByRole('radio');
    await storageOptions.first().click();
    const selectedStorage = await storageOptions.first().textContent();

    // 5. Select first color option
    const colorGroup = page.getByRole('radiogroup', { name: /color/i });
    const colorOptions = colorGroup.getByRole('radio');
    await colorOptions.first().click();

    // 6. Button now enabled — add to cart
    await expect(addButton).toBeEnabled();
    await addButton.click();

    // 7. Navigates to cart
    await page.waitForURL('/cart');

    // 8. Cart shows the item
    const cartHeading = page.locator('h1');
    await expect(cartHeading).toContainText('Cart');
    await expect(cartHeading).toContainText('(1)');

    // Verify item details are visible
    const cartArticle = page.locator('article').first();
    await expect(cartArticle).toBeVisible();

    // Verify storage and color appear in item description
    if (selectedStorage) {
      await expect(cartArticle).toContainText(selectedStorage);
    }

    // 9. Remove button is present
    const removeButton = page.getByRole('button', { name: /remove|eliminar/i });
    await expect(removeButton).toBeVisible();

    // 10. Pay button and continue shopping link are present
    const payButton = page.getByRole('button', { name: /pay/i }).first();
    await expect(payButton).toBeVisible();

    const continueLink = page
      .getByRole('link', { name: /continue shopping/i })
      .first();
    await expect(continueLink).toBeVisible();
  });

  test('remove item from cart empties it', async ({ page }) => {
    // Add an item first
    await page.goto('/');
    const productLinks = page.locator('a[href^="/product/"]');
    await productLinks.first().waitFor({ state: 'visible', timeout: 15000 });
    await productLinks.first().click();
    await page.waitForURL(/\/product\/.+/);

    // Select options
    const storageGroup = page.getByRole('radiogroup', { name: /storage/i });
    await storageGroup.getByRole('radio').first().click();
    const colorGroup = page.getByRole('radiogroup', { name: /color/i });
    await colorGroup.getByRole('radio').first().click();

    // Add to cart
    await page.getByRole('button', { name: /añadir|add/i }).click();
    await page.waitForURL('/cart');

    // Remove the item
    const removeButton = page.getByRole('button', {
      name: /remove|eliminar/i,
    });
    await removeButton.click();

    // Cart is now empty
    await expect(page.locator('h1')).toContainText('(0)');
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test('cart persists across navigation', async ({ page }) => {
    // Add an item
    await page.goto('/');
    const productLinks = page.locator('a[href^="/product/"]');
    await productLinks.first().waitFor({ state: 'visible', timeout: 15000 });
    await productLinks.first().click();
    await page.waitForURL(/\/product\/.+/);

    const storageGroup = page.getByRole('radiogroup', { name: /storage/i });
    await storageGroup.getByRole('radio').first().click();
    const colorGroup = page.getByRole('radiogroup', { name: /color/i });
    await colorGroup.getByRole('radio').first().click();

    await page.getByRole('button', { name: /añadir|add/i }).click();
    await page.waitForURL('/cart');
    await expect(page.locator('h1')).toContainText('(1)');

    // Navigate to home via "Continue shopping"
    await page.getByRole('link', { name: /continue shopping/i }).first().click();
    await page.waitForURL('/');

    // Go back to cart
    await page.goto('/cart');
    await expect(page.locator('h1')).toContainText('(1)');
  });

  test('add to cart button disabled until both options selected', async ({
    page,
  }) => {
    await page.goto('/');
    const productLinks = page.locator('a[href^="/product/"]');
    await productLinks.first().waitFor({ state: 'visible', timeout: 15000 });
    await productLinks.first().click();
    await page.waitForURL(/\/product\/.+/);

    const addButton = page.getByRole('button', { name: /añadir|add/i });
    await addButton.waitFor({ state: 'visible', timeout: 10000 });

    // Initially disabled
    await expect(addButton).toBeDisabled();

    // Select only storage — still disabled
    const storageGroup = page.getByRole('radiogroup', { name: /storage/i });
    await storageGroup.getByRole('radio').first().click();
    await expect(addButton).toBeDisabled();

    // Select color — now enabled
    const colorGroup = page.getByRole('radiogroup', { name: /color/i });
    await colorGroup.getByRole('radio').first().click();
    await expect(addButton).toBeEnabled();
  });
});
