import { EErrorOptions } from '@dhruv-techapps/acf-common';
import { expect, SettingsRetryPage, pageTest as test } from '../fixtures';

test.describe('Settings — Retry', () => {
  test.describe.configure({ mode: 'serial' });

  test('should render all retry form elements', async ({ settingsRetryPage }) => {
    await expect(settingsRetryPage.form).toBeVisible();
    await expect(settingsRetryPage.retryInput).toBeVisible();
    await expect(settingsRetryPage.unlimitedBtn).toBeVisible();
    await expect(settingsRetryPage.intervalInput).toBeVisible();
    await expect(settingsRetryPage.intervalRangeBtn).toBeVisible();
    await expect(settingsRetryPage.optionStop).toBeVisible();
    await expect(settingsRetryPage.optionSkip).toBeVisible();
    await expect(settingsRetryPage.optionReload).toBeVisible();
    await expect(settingsRetryPage.saveBtn).toBeVisible();
    await expect(settingsRetryPage.cancelBtn).toBeVisible();
  });

  test('should have save button disabled when form is pristine', async ({ settingsRetryPage }) => {
    await expect(settingsRetryPage.saveBtn).toBeDisabled();
  });

  test('should enable save button after changing retry count', async ({ settingsRetryPage }) => {
    await settingsRetryPage.setRetryCount('6');

    await expect(settingsRetryPage.saveBtn).toBeEnabled();
  });

  test('should reset form to original values on cancel', async ({ settingsRetryPage }) => {
    const originalValue = await settingsRetryPage.getRetryCount();

    await settingsRetryPage.setRetryCount('99');
    await settingsRetryPage.cancel();

    await expect(settingsRetryPage.retryInput).toHaveValue(originalValue);
    await expect(settingsRetryPage.saveBtn).toBeDisabled();
  });

  test('should disable input and show "unlimited" when infinity button is clicked', async ({ settingsRetryPage }) => {
    await settingsRetryPage.toggleUnlimited();

    // list attr is removed when unlimited → role changes from combobox to textbox
    const disabledInput = settingsRetryPage.retryInput;
    await expect(disabledInput).toBeDisabled();
    await expect(disabledInput).toHaveValue('unlimited');
  });

  test('should re-enable input when infinity button is clicked again', async ({ settingsRetryPage }) => {
    await settingsRetryPage.toggleUnlimited();
    await settingsRetryPage.toggleUnlimited();

    await expect(settingsRetryPage.retryInput).toBeEnabled();
  });

  test('should show second interval input when range button is clicked', async ({ settingsRetryPage }) => {
    await expect(settingsRetryPage.intervalInput).toBeVisible();
    await settingsRetryPage.toggleRange();
    await expect(settingsRetryPage.intervalInputRange).toBeVisible();
  });

  test('should hide second interval input when range button is clicked again', async ({ settingsRetryPage }) => {
    await settingsRetryPage.toggleRange();
    await settingsRetryPage.toggleRange();

    await expect(settingsRetryPage.intervalInput).toBeVisible();
    await expect(settingsRetryPage.intervalInputRange).toBeHidden();
  });

  test('should NOT sync settings to extension storage before any change', async ({ page, getSettings }) => {
    const settingsBefore = await getSettings();

    const settingsRetryPage = new SettingsRetryPage(page);
    await settingsRetryPage.goto();

    const settingsAfter = await getSettings();
    expect(settingsAfter).toEqual(settingsBefore);
  });

  test('should save retry count to extension storage', async ({ settingsRetryPage, getSettings, toastPage }) => {
    await settingsRetryPage.setRetryCount('3');
    await settingsRetryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retry, { timeout: 5000 }).toBe(3);
  });

  test('should save unlimited retry to extension storage', async ({ settingsRetryPage, getSettings, toastPage }) => {
    await settingsRetryPage.toggleUnlimited();
    await settingsRetryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retry, { timeout: 5000 }).toBe('unlimited');
  });

  test('should save retry interval to extension storage', async ({ settingsRetryPage, getSettings, toastPage }) => {
    await settingsRetryPage.setInterval('2');
    await settingsRetryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retryInterval, { timeout: 5000 }).toBe(2);
  });

  test('should save retry interval range to extension storage', async ({ settingsRetryPage, getSettings, toastPage }) => {
    await settingsRetryPage.setIntervalRange('1', '5');
    await settingsRetryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retryIntervalTo, { timeout: 5000 }).toBe(5);
  });

  test('should save retryOption SKIP to extension storage', async ({ settingsRetryPage, getSettings, toastPage }) => {
    await settingsRetryPage.optionSkip.click();
    await settingsRetryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retryOption, { timeout: 5000 }).toBe(EErrorOptions.SKIP);
  });

  test('should save retryOption RELOAD to extension storage', async ({ settingsRetryPage, getSettings, toastPage }) => {
    await settingsRetryPage.optionReload.click();
    await settingsRetryPage.save();

    await toastPage.waitForSuccess();
    await expect.poll(async () => (await getSettings())?.retryOption, { timeout: 5000 }).toBe(EErrorOptions.RELOAD);
  });
});
