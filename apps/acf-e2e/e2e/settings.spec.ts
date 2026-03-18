import { expect, pageTest as test } from './fixtures';

test.describe('Global settings navigation', () => {
  test('should navigate to settings page and show nav links', async ({ settingsPage }) => {
    await settingsPage.goto();
    // Assert — nav container and all nav links are visible
    await expect(settingsPage.nav).toBeVisible();
    await expect(settingsPage.navRetry).toBeVisible();
    await expect(settingsPage.navNotification).toBeVisible();
    await expect(settingsPage.navBackup).toBeVisible();
    await expect(settingsPage.navGoogleSheets).toBeVisible();
    await expect(settingsPage.navAdditional).toBeVisible();
  });

  test('should navigate between settings sections via nav links', async ({ settingsPage }) => {
    await settingsPage.goto();
    // Act — navigate to notification
    await settingsPage.navigateTo('notification');

    // Assert
    await expect(settingsPage.notificationsContainer).toBeVisible();

    // Act — navigate to additional
    await settingsPage.navigateTo('additional');

    // Assert
    await expect(settingsPage.additionalForm).toBeVisible();
  });
});
