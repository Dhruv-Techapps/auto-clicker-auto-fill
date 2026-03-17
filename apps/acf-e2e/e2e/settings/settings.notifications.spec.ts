import { expect, pageTest as test } from '../fixtures';

test.describe('Settings — Notifications', () => {
  test.describe.configure({ mode: 'serial' });

  test('should render all notification elements', async ({ settingsNotificationsPage }) => {
    // Assert — notification container and all switches are visible
    await expect(settingsNotificationsPage.container).toBeVisible();
    await expect(settingsNotificationsPage.onError).toBeVisible();
    await expect(settingsNotificationsPage.onAction).toBeVisible();
    await expect(settingsNotificationsPage.onBatch).toBeVisible();
    await expect(settingsNotificationsPage.onConfig).toBeVisible();
    await expect(settingsNotificationsPage.sound).toBeVisible();
  });

  test('should toggle onError and save to extension storage', async ({ settingsNotificationsPage, getSettings, toastPage }) => {
    // Act
    await settingsNotificationsPage.toggleOnError();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.onError, { timeout: 5000 }).toBe(true);
  });

  test('should toggle onAction and save to extension storage', async ({ settingsNotificationsPage, getSettings, toastPage }) => {
    // Act
    await settingsNotificationsPage.toggleOnAction();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.onAction, { timeout: 5000 }).toBe(true);
  });

  test('should toggle onBatch and save to extension storage', async ({ settingsNotificationsPage, getSettings, toastPage }) => {
    // Act
    await settingsNotificationsPage.toggleOnBatch();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.onBatch, { timeout: 5000 }).toBe(true);
  });

  test('should toggle onConfig and save to extension storage', async ({ settingsNotificationsPage, getSettings, toastPage }) => {
    // Act
    await settingsNotificationsPage.toggleOnConfig();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.onConfig, { timeout: 5000 }).toBe(true);
  });

  test('should toggle sound and save to extension storage', async ({ settingsNotificationsPage, getSettings, toastPage }) => {
    // Act
    await settingsNotificationsPage.toggleSound();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.sound, { timeout: 5000 }).toBe(true);
  });
});
