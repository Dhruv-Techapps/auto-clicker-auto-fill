import { IConfiguration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { URLS } from './fixtures/base-url';
import { expect, test } from './fixtures/extension';
const UUID_REGEX = /\/automations\/[a-f0-9-]{36}/;

test.describe('Config creation and sync', () => {
  test('extension loads without errors', async ({ context, extensionId }) => {
    expect(extensionId).toBeTruthy();
    expect(extensionId.length).toBeGreaterThan(0);
    console.log('[Test] Extension loaded with ID:', extensionId);
  });
  test('should NOT sync to extension storage immediately after addConfig', async ({ context, page }) => {
    // Arrange — record storage state before adding config
    const [sw] = context.serviceWorkers();
    if (!sw) throw new Error('Extension service worker not available');
    const configsBefore: Array<IConfiguration> = (await sw.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key] ?? []), LOCAL_STORAGE_KEY.CONFIGS)) as Array<IConfiguration>;

    await page.goto(URLS.AUTOMATIONS);

    // Act — click + (dispatches addConfig only, no middleware sync)
    await page.getByTestId('automations-add-automation').click();
    await page.waitForURL(UUID_REGEX);

    // Assert — chrome.storage unchanged (middleware does not watch addConfig)
    const configsAfter: Array<IConfiguration> = (await sw.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key] ?? []), LOCAL_STORAGE_KEY.CONFIGS)) as Array<IConfiguration>;

    expect(configsAfter.length).toBe(configsBefore.length);
  });
});
