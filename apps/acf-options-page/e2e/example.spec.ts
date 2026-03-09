import { expect, test } from './fixtures/extension';

test('should load extension when browser launches', async ({ extensionId }) => {
  expect(extensionId).toBeTruthy();
  console.log('Extension ID:', extensionId);
});

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('Welcome');
});
