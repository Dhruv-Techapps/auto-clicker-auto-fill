import { test as baseTest, expect } from '../fixtures/extension';
import { ToastPage } from '../fixtures/toast.page';
import { SettingsAdditionalPage } from './settings.additional.page';

const test = baseTest.extend<{ additionalPage: SettingsAdditionalPage; toastPage: ToastPage }>({
  additionalPage: async ({ page }, use) => {
    const additionalPage = new SettingsAdditionalPage(page);
    await additionalPage.goto();
    await use(additionalPage);
  },
  toastPage: async ({ page }, use) => {
    await use(new ToastPage(page));
  }
});

test.describe('Settings — Additional', () => {
  test.describe.configure({ mode: 'serial' });

  test('should render all additional form elements', async ({ additionalPage }) => {
    // Assert — all form controls and action buttons are visible
    await expect(additionalPage.form).toBeVisible();
    await expect(additionalPage.checkiFrames).toBeVisible();
    await expect(additionalPage.reloadOnError).toBeVisible();
    await expect(additionalPage.statusBarHide).toBeVisible();
    await expect(additionalPage.statusBarTopLeft).toBeVisible();
    await expect(additionalPage.statusBarTopRight).toBeVisible();
    await expect(additionalPage.statusBarBottomLeft).toBeVisible();
    await expect(additionalPage.statusBarBottomRight).toBeVisible();
    await expect(additionalPage.saveBtn).toBeVisible();
    await expect(additionalPage.cancelBtn).toBeVisible();
  });

  test('should have save button disabled when form is pristine', async ({ additionalPage }) => {
    await expect(additionalPage.saveBtn).toBeDisabled();
  });

  test('should enable save button after toggling checkiFrames', async ({ additionalPage }) => {
    // Act
    await additionalPage.toggleCheckiFrames();

    // Assert
    await expect(additionalPage.saveBtn).toBeEnabled();
  });

  test('should reset form to original values on cancel', async ({ additionalPage }) => {
    // Act
    await additionalPage.toggleCheckiFrames();
    await additionalPage.cancel();

    // Assert — save button is disabled again after reset
    await expect(additionalPage.saveBtn).toBeDisabled();
  });

  test('should save checkiFrames to extension storage', async ({ additionalPage, getSettings, toastPage }) => {
    // Act
    await additionalPage.toggleCheckiFrames();
    await additionalPage.save();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.checkiFrames, { timeout: 5000 }).toBe(true);
  });

  test('should save reloadOnError to extension storage', async ({ additionalPage, getSettings, toastPage }) => {
    // Act
    await additionalPage.toggleReloadOnError();
    await additionalPage.save();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.reloadOnError, { timeout: 5000 }).toBe(true);
  });

  test('should save statusBar position to extension storage', async ({ additionalPage, getSettings, toastPage }) => {
    // Act
    await additionalPage.selectStatusBar('top-left');
    await additionalPage.save();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.statusBar, { timeout: 5000 }).toBe('top-left');
  });
});
