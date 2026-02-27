import { expect, test } from '../fixtures/extension';

test.describe('Chrome Extension', () => {
  test('should load extension service worker when extension is installed', async ({
    extensionId,
  }) => {
    // Extension IDs are always 32 lowercase alpha characters
    expect(extensionId).toBeTruthy();
    expect(extensionId).toMatch(/^[a-z]{32}$/);
  });

  test('should open extension page when navigating to chrome-extension URL', async ({
    context,
    extensionId,
  }) => {
    const extensionPage = await context.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/popup.html`);

    // The page should be reachable (not a chrome-error page)
    await expect(extensionPage.locator('body')).toBeVisible();
    await extensionPage.close();
  });
});
