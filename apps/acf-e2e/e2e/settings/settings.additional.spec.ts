import { expect, pageTest as test } from '../fixtures';

test.describe('Settings — Additional', () => {
  test.describe.configure({ mode: 'serial' });

  test('should render all additional form elements', async ({ settingsAdditionalPage }) => {
    await settingsAdditionalPage.goto();
    // Assert — all form controls and action buttons are visible
    await expect(settingsAdditionalPage.form).toBeVisible();
    await expect(settingsAdditionalPage.checkiFrames).toBeVisible();
    await expect(settingsAdditionalPage.reloadOnError).toBeVisible();
    await expect(settingsAdditionalPage.statusBarHide).toBeVisible();
    await expect(settingsAdditionalPage.statusBarTopLeft).toBeVisible();
    await expect(settingsAdditionalPage.statusBarTopRight).toBeVisible();
    await expect(settingsAdditionalPage.statusBarBottomLeft).toBeVisible();
    await expect(settingsAdditionalPage.statusBarBottomRight).toBeVisible();
    await expect(settingsAdditionalPage.saveBtn).toBeVisible();
    await expect(settingsAdditionalPage.cancelBtn).toBeVisible();
  });

  test('should have save button disabled when form is pristine', async ({ settingsAdditionalPage }) => {
    await settingsAdditionalPage.goto();
    await expect(settingsAdditionalPage.saveBtn).toBeDisabled();
  });

  test('should enable save button after toggling checkiFrames', async ({ settingsAdditionalPage }) => {
    await settingsAdditionalPage.goto();
    // Act
    await settingsAdditionalPage.toggleCheckiFrames();

    // Assert
    await expect(settingsAdditionalPage.saveBtn).toBeEnabled();
  });

  test('should reset form to original values on cancel', async ({ settingsAdditionalPage }) => {
    await settingsAdditionalPage.goto();
    // Act
    await settingsAdditionalPage.toggleCheckiFrames();
    await settingsAdditionalPage.cancel();

    // Assert — save button is disabled again after reset
    await expect(settingsAdditionalPage.saveBtn).toBeDisabled();
  });

  test('should save checkiFrames to extension storage', async ({ settingsAdditionalPage, getSettings, toastPage }) => {
    await settingsAdditionalPage.goto();
    // Act
    await settingsAdditionalPage.toggleCheckiFrames();
    await settingsAdditionalPage.save();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.checkiFrames, { timeout: 5000 }).toBe(true);
  });

  test('should save reloadOnError to extension storage', async ({ settingsAdditionalPage, getSettings, toastPage }) => {
    await settingsAdditionalPage.goto();
    // Act
    await settingsAdditionalPage.toggleReloadOnError();
    await settingsAdditionalPage.save();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.reloadOnError, { timeout: 5000 }).toBe(true);
  });

  test('should save statusBar position to extension storage', async ({ settingsAdditionalPage, getSettings, toastPage }) => {
    await settingsAdditionalPage.goto();
    // Act
    await settingsAdditionalPage.selectStatusBar('top-left');
    await settingsAdditionalPage.save();

    // Assert
    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.statusBar, { timeout: 5000 }).toBe('top-left');
  });
});
