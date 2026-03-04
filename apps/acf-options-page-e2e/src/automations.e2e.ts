import { expect, test } from '../fixtures/extension';

test.describe('Automations page', () => {
  test('should navigate to automations page when visiting automations URL', async ({ page }) => {
    await page.goto('/automations');

    await expect(page).toHaveURL('/automations');
  });

  test('should display body content when automations page loads', async ({ page }) => {
    await page.goto('/automations');

    await expect(page.locator('body')).toBeVisible();
  });
});
