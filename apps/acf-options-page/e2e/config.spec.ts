import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { expect, test } from './fixtures/extension';

const BASE_URL = 'http://localhost:4200';
const UUID_REGEX = /\/automations\/[a-f0-9-]{36}/;
const TEST_URL = 'https://test.getautoclicker.com';

test.describe('Config creation and sync', () => {
  test.describe.configure({ mode: 'serial' });
  test('should add config to store when + button is clicked from automations page', async ({ page }) => {
    // Arrange
    await page.goto(`${BASE_URL}/automations`);

    // Act
    await page.getByTestId('automations-add-automation').click();

    // Assert — navigated to new automation route with a UUID
    await page.waitForURL(UUID_REGEX);
    expect(page.url()).toMatch(UUID_REGEX);

    // Assert — URL input form is shown (automation has no URL yet → AutomationNew renders)
    await expect(page.getByTestId('automation-url-form')).toBeVisible();
    await expect(page.getByTestId('automation-url-input')).toBeVisible();
  });

  test('should add config to store when + button is clicked from sidebar', async ({ page }) => {
    // Arrange
    await page.goto(`${BASE_URL}/automations`);

    // Act
    await page.getByTestId('sidebar-add-automation').click();

    // Assert — navigated to new automation route with a UUID
    await page.waitForURL(UUID_REGEX);
    expect(page.url()).toMatch(UUID_REGEX);

    // Assert — URL input form is rendered
    await expect(page.getByTestId('automation-url-form')).toBeVisible();
  });

  test('should NOT sync to extension storage immediately after addConfig', async ({ context, page }) => {
    // Arrange — record storage state before adding config
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    const configsBefore: unknown[] = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key] ?? []), LOCAL_STORAGE_KEY.CONFIGS)) as unknown[];

    await page.goto(`${BASE_URL}/automations`);

    // Act — click + (dispatches addConfig only, no middleware sync)
    await page.getByTestId('automations-add-automation').click();
    await page.waitForURL(UUID_REGEX);

    // Assert — chrome.storage unchanged (middleware does not watch addConfig)
    const configsAfter: unknown[] = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key] ?? []), LOCAL_STORAGE_KEY.CONFIGS)) as unknown[];

    expect(configsAfter.length).toBe(configsBefore.length);
  });

  test('should sync config to extension storage when URL is entered and form submitted', async ({ context, page }) => {
    // Arrange
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await page.goto(`${BASE_URL}/automations`);
    await page.getByTestId('automations-add-automation').click();
    await page.waitForURL(UUID_REGEX);

    // Capture the new automation ID from the URL
    const automationId = page.url().split('/').pop() as string;

    // Record storage length before submitting URL
    const configsBefore: unknown[] = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key] ?? []), LOCAL_STORAGE_KEY.CONFIGS)) as unknown[];

    // Act — fill URL and submit (dispatches updateConfig → middleware → chrome.storage)
    await page.getByTestId('automation-url-input').fill(TEST_URL);
    await page.getByTestId('automation-url-form').press('Enter');

    // Assert — storage now contains the config with the entered URL
    await expect
      .poll(
        async () => {
          const configs = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key] ?? []), LOCAL_STORAGE_KEY.CONFIGS)) as Array<{ id: string; url: string }>;
          return configs.find((c) => c.id === automationId)?.url;
        },
        { timeout: 5000 }
      )
      .toBe(TEST_URL);

    // Assert — storage length increased by 6 (5 pre-loaded defaults + 1 new automation).
    // The first sync writes the entire Redux configs array to chrome.storage, which
    // includes the 5 demo configs pre-populated in the store for display purposes.
    const configsAfter: unknown[] = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key] ?? []), LOCAL_STORAGE_KEY.CONFIGS)) as unknown[];

    expect(configsAfter.length).toBe(configsBefore.length + 6);
  });
});
