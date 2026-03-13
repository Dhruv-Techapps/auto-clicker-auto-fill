import { test as baseTest, expect } from '../fixtures/extension';
import { ToastPage } from '../fixtures/toast.page';
import { SettingsNotificationsPage } from './settings.notifications.page';

const test = baseTest.extend<{ notificationsPage: SettingsNotificationsPage; toastPage: ToastPage }>({
  notificationsPage: async ({ page }, use) => {
    const notificationsPage = new SettingsNotificationsPage(page);
    await notificationsPage.goto();
    await use(notificationsPage);
  },
  toastPage: async ({ page }, use) => {
    await use(new ToastPage(page));
  }
});

test.describe('Settings — Notifications', () => {
  test.describe.configure({ mode: 'serial' });

  test('should render all notification elements', async ({ notificationsPage }) => {
    // Assert — notification container and all switches are visible
    await expect(notificationsPage.container).toBeVisible();
    await expect(notificationsPage.onError).toBeVisible();
    await expect(notificationsPage.onAction).toBeVisible();
    await expect(notificationsPage.onBatch).toBeVisible();
    await expect(notificationsPage.onConfig).toBeVisible();
    await expect(notificationsPage.sound).toBeVisible();
  });

  test('should toggle onError and save to extension storage', async ({ notificationsPage, getSettings, toastPage }) => {
    // Act
    await notificationsPage.toggleOnError();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.onError, { timeout: 5000 }).toBe(true);
  });

  test('should toggle onAction and save to extension storage', async ({ notificationsPage, getSettings, toastPage }) => {
    // Act
    await notificationsPage.toggleOnAction();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.onAction, { timeout: 5000 }).toBe(true);
  });

  test('should toggle onBatch and save to extension storage', async ({ notificationsPage, getSettings, toastPage }) => {
    // Act
    await notificationsPage.toggleOnBatch();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.onBatch, { timeout: 5000 }).toBe(true);
  });

  test('should toggle onConfig and save to extension storage', async ({ notificationsPage, getSettings, toastPage }) => {
    // Act
    await notificationsPage.toggleOnConfig();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.onConfig, { timeout: 5000 }).toBe(true);
  });

  test('should toggle sound and save to extension storage', async ({ notificationsPage, getSettings, toastPage }) => {
    // Act
    await notificationsPage.toggleSound();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.notifications?.sound, { timeout: 5000 }).toBe(true);
  });
});
