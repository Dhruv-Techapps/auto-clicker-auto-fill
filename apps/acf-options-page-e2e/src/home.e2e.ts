import { expect, test } from '../fixtures/extension';

test.describe('Home page', () => {
  test('should load home page when navigating to root', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/');
  });

  test('should display body content when home page loads', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
  });
});
