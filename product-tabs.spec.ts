import { test, expect } from '@playwright/test';

test('product page tabs switch content', async ({ page }) => {
  await page.route('**/api/products/*', async (route) => {
    const url = route.request().url();
    const id = url.split('/').pop();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id,
        name: 'Test Dress',
        description: 'This is a test description.',
        price: 12345,
        category: 'Dress',
        imageUrl: null,
        video: null,
        featured: false
      }),
    });
  });

  await page.goto('/product/1');
  await expect(page.getByText('Test Dress')).toBeVisible();
  await expect(page.getByText('This is a test description.')).toBeVisible();

  await page.getByRole('button', { name: 'specifications' }).click();
  await expect(page.getByText('Material')).toBeVisible();

  await page.getByRole('button', { name: 'shipping' }).click();
  await expect(page.getByText('We offer standard delivery')).toBeVisible();
});
