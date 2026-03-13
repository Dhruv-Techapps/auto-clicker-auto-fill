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
    await expect(page.getByTestId('settings-additional-statusBar-hide')).toBeVisible();
    await expect(page.getByTestId('settings-additional-statusBar-top-left')).toBeVisible();
    await expect(page.getByTestId('settings-additional-statusBar-top-right')).toBeVisible();
    await expect(page.getByTestId('settings-additional-statusBar-bottom-left')).toBeVisible();
    await expect(page.getByTestId('settings-additional-statusBar-bottom-right')).toBeVisible();
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
