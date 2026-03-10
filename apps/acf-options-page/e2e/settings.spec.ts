import { ISettings, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { URLS } from './fixtures/base-url';
import { expect, test } from './fixtures/extension';

test.describe('Global settings navigation', () => {
  test('should navigate to settings page and show nav links', async ({ page }) => {
    // Arrange
    await page.goto(URLS.SETTINGS);

    // Assert — nav container and all nav links are visible
    await expect(page.getByTestId('settings-nav')).toBeVisible();
    await expect(page.getByTestId('settings-nav-retry')).toBeVisible();
    await expect(page.getByTestId('settings-nav-notification')).toBeVisible();
    await expect(page.getByTestId('settings-nav-backup')).toBeVisible();
    await expect(page.getByTestId('settings-nav-google-sheets')).toBeVisible();
    await expect(page.getByTestId('settings-nav-additional')).toBeVisible();
  });

  test('should show retry settings form when navigating to retry page', async ({ page }) => {
    // Arrange
    await page.goto(URLS.SETTINGS_RETRY);

    // Assert — retry form is visible with save/cancel buttons
    await expect(page.getByTestId('settings-retry-form')).toBeVisible();
    await expect(page.getByTestId('settings-retry-save')).toBeVisible();
    await expect(page.getByTestId('settings-retry-cancel')).toBeVisible();
  });

  test('should show notification settings when navigating to notification page', async ({ page }) => {
    // Arrange
    await page.goto(URLS.SETTINGS_NOTIFICATION);

    // Assert — notification switches are visible
    await expect(page.getByTestId('settings-notifications')).toBeVisible();
    await expect(page.getByTestId('settings-notification-onError')).toBeVisible();
    await expect(page.getByTestId('settings-notification-onAction')).toBeVisible();
    await expect(page.getByTestId('settings-notification-onBatch')).toBeVisible();
    await expect(page.getByTestId('settings-notification-onConfig')).toBeVisible();
    await expect(page.getByTestId('settings-notification-sound')).toBeVisible();
  });

  test('should show additional settings form when navigating to additional page', async ({ page }) => {
    // Arrange
    await page.goto(URLS.SETTINGS_ADDITIONAL);

    // Assert — additional settings form with switches and buttons are visible
    await expect(page.getByTestId('settings-additional-form')).toBeVisible();
    await expect(page.getByTestId('settings-additional-checkiFrames')).toBeVisible();
    await expect(page.getByTestId('settings-additional-reloadOnError')).toBeVisible();
    await expect(page.getByTestId('settings-additional-cancel')).toBeVisible();
    await expect(page.getByTestId('settings-additional-save')).toBeVisible();
  });

  test('should navigate between settings sections via nav links', async ({ page }) => {
    // Arrange
    await page.goto(URLS.SETTINGS);

    // Act — click notification nav link
    await page.getByTestId('settings-nav-notification').click();

    // Assert — notification section is shown
    await expect(page.getByTestId('settings-notifications')).toBeVisible();

    // Act — click additional nav link
    await page.getByTestId('settings-nav-additional').click();

    // Assert — additional section is shown
    await expect(page.getByTestId('settings-additional-form')).toBeVisible();
  });
});

test.describe('Global settings sync to extension', () => {
  test.describe.configure({ mode: 'serial' });

  test('should NOT sync settings to extension storage before any change', async ({ context, page }) => {
    // Arrange — record storage state before navigating
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    const settingsBefore = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key]), LOCAL_STORAGE_KEY.SETTINGS)) as ISettings;

    await page.goto(URLS.SETTINGS_RETRY);

    // Assert — chrome.storage.local[SETTINGS] unchanged after page load (no mutations)
    const settingsAfter = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key]), LOCAL_STORAGE_KEY.SETTINGS)) as ISettings;
    expect(settingsAfter).toEqual(settingsBefore);
  });

  test('should sync retry settings to extension storage when saved', async ({ context, page }) => {
    // Arrange
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await page.goto(URLS.SETTINGS_RETRY);

    // Act — select SKIP retry option and save
    await page.getByTestId('settings-retry-option-skip').click();
    await page.getByTestId('settings-retry-save').click();

    // Assert — chrome.storage.local[SETTINGS] is updated with the new retryOption
    await expect
      .poll(
        async () => {
          const settings = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key]), LOCAL_STORAGE_KEY.SETTINGS)) as ISettings;
          return settings?.retryOption;
        },
        { timeout: 5000 }
      )
      .toBe('skip');
  });

  test('should sync notification settings to extension storage when toggled', async ({ context, page }) => {
    // Arrange
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await page.goto(URLS.SETTINGS_NOTIFICATION);

    // Act — toggle onError notification
    await page.getByTestId('settings-notification-onError').click();

    // Assert — chrome.storage.local[SETTINGS].notifications.onError is updated
    await expect
      .poll(
        async () => {
          const settings = (await worker.evaluate((key: string) => chrome.storage.local.get(key).then((r) => r[key]), LOCAL_STORAGE_KEY.SETTINGS)) as ISettings;
          return settings?.notifications?.onError;
        },
        { timeout: 5000 }
      )
      .toBe(true);
  });
});
