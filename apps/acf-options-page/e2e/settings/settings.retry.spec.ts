import { EErrorOptions } from '@dhruv-techapps/acf-common';
import { test as baseTest, expect } from '../fixtures/extension';
import { ToastPage } from '../fixtures/toast.page';
import { SettingsRetryPage } from './settings.retry.page';

const test = baseTest.extend<{ retryPage: SettingsRetryPage; toastPage: ToastPage }>({
  retryPage: async ({ page }, use) => {
    const retryPage = new SettingsRetryPage(page);
    await retryPage.goto();
    await use(retryPage);
  }
});

test.describe('Settings — Retry', () => {
  test.describe.configure({ mode: 'serial' });

  test('should render all retry form elements', async ({ retryPage }) => {
    await expect(retryPage.form).toBeVisible();
    await expect(retryPage.retryInput).toBeVisible();
    await expect(retryPage.unlimitedBtn).toBeVisible();
    await expect(retryPage.intervalInput).toBeVisible();
    await expect(retryPage.intervalRangeBtn).toBeVisible();
    await expect(retryPage.optionStop).toBeVisible();
    await expect(retryPage.optionSkip).toBeVisible();
    await expect(retryPage.optionReload).toBeVisible();
    await expect(retryPage.saveBtn).toBeVisible();
    await expect(retryPage.cancelBtn).toBeVisible();
  });

  test('should have save button disabled when form is pristine', async ({ retryPage }) => {
    await expect(retryPage.saveBtn).toBeDisabled();
  });

  test('should enable save button after changing retry count', async ({ retryPage }) => {
    await retryPage.setRetryCount('6');

    await expect(retryPage.saveBtn).toBeEnabled();
  });

  test('should reset form to original values on cancel', async ({ retryPage }) => {
    const originalValue = await retryPage.getRetryCount();

    await retryPage.setRetryCount('99');
    await retryPage.cancel();

    await expect(retryPage.retryInput).toHaveValue(originalValue);
    await expect(retryPage.saveBtn).toBeDisabled();
  });

  test('should disable input and show "unlimited" when infinity button is clicked', async ({ retryPage }) => {
    await retryPage.toggleUnlimited();

    // list attr is removed when unlimited → role changes from combobox to textbox
    const disabledInput = retryPage.retryInput;
    await expect(disabledInput).toBeDisabled();
    await expect(disabledInput).toHaveValue('unlimited');
  });

  test('should re-enable input when infinity button is clicked again', async ({ retryPage }) => {
    await retryPage.toggleUnlimited();
    await retryPage.toggleUnlimited();

    await expect(retryPage.retryInput).toBeEnabled();
  });

  test('should show second interval input when range button is clicked', async ({ retryPage }) => {
    await expect(retryPage.intervalInput).toBeVisible();
    await retryPage.toggleRange();
    await expect(retryPage.intervalInputRange).toBeVisible();
  });

  test('should hide second interval input when range button is clicked again', async ({ retryPage }) => {
    await retryPage.toggleRange();
    await retryPage.toggleRange();

    await expect(retryPage.intervalInput).toBeVisible();
    await expect(retryPage.intervalInputRange).not.toBeVisible();
  });

  test('should NOT sync settings to extension storage before any change', async ({ page, getSettings }) => {
    const settingsBefore = await getSettings();

    const retryPage = new SettingsRetryPage(page);
    await retryPage.goto();

    const settingsAfter = await getSettings();
    expect(settingsAfter).toEqual(settingsBefore);
  });

  test('should save retry count to extension storage', async ({ retryPage, getSettings, toastPage }) => {
    await retryPage.setRetryCount('3');
    await retryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retry, { timeout: 5000 }).toBe(3);
  });

  test('should save unlimited retry to extension storage', async ({ retryPage, getSettings, toastPage }) => {
    await retryPage.toggleUnlimited();
    await retryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retry, { timeout: 5000 }).toBe('unlimited');
  });

  test('should save retry interval to extension storage', async ({ retryPage, getSettings, toastPage }) => {
    await retryPage.setInterval('2');
    await retryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retryInterval, { timeout: 5000 }).toBe(2);
  });

  test('should save retry interval range to extension storage', async ({ retryPage, getSettings, toastPage }) => {
    await retryPage.setIntervalRange('1', '5');
    await retryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retryIntervalTo, { timeout: 5000 }).toBe(5);
  });

  test('should save retryOption SKIP to extension storage', async ({ retryPage, getSettings, toastPage }) => {
    await retryPage.optionSkip.click();
    await retryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retryOption, { timeout: 5000 }).toBe(EErrorOptions.SKIP);
  });

  test('should save retryOption RELOAD to extension storage', async ({ retryPage, getSettings, toastPage }) => {
    await retryPage.optionReload.click();
    await retryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retryOption, { timeout: 5000 }).toBe(EErrorOptions.RELOAD);
  });
});
