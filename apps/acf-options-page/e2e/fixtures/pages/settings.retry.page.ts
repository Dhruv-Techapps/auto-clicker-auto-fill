import type { Locator, Page } from '@playwright/test';
import { URLS } from '../base-url';

export class SettingsRetryPage {
  readonly form: Locator;
  readonly retryInput: Locator;
  readonly unlimitedBtn: Locator;
  readonly intervalInput: Locator;
  readonly intervalInputRange: Locator;
  readonly intervalRangeBtn: Locator;
  readonly optionStop: Locator;
  readonly optionSkip: Locator;
  readonly optionReload: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(public readonly page: Page) {
    this.form = page.getByTestId('settings-retry-form');
    this.retryInput = page.getByTestId('settings-retry-retry');
    this.unlimitedBtn = page.getByTestId('settings-retry-retry-unlimited');
    this.intervalInput = page.getByTestId('settings-retry-interval-retryInterval');
    this.intervalInputRange = page.getByTestId('settings-retry-interval-retryIntervalTo');
    this.intervalRangeBtn = page.getByTestId('settings-retry-interval-range-button');
    this.optionStop = page.getByTestId('settings-retry-option-stop');
    this.optionSkip = page.getByTestId('settings-retry-option-skip');
    this.optionReload = page.getByTestId('settings-retry-option-reload');
    this.saveBtn = page.getByTestId('settings-retry-save');
    this.cancelBtn = page.getByTestId('settings-retry-cancel');
  }

  async goto() {
    await this.page.goto(URLS.SETTINGS_RETRY);
  }

  async setRetryCount(value: string) {
    await this.retryInput.fill(value);
  }

  async getRetryCount() {
    return this.retryInput.inputValue();
  }

  async toggleUnlimited() {
    await this.unlimitedBtn.click();
  }

  async setInterval(value: string) {
    await this.intervalInput.fill(value);
  }

  async toggleRange() {
    await this.intervalRangeBtn.click();
  }

  async setIntervalRange(from: string, to: string) {
    await this.toggleRange();
    await this.intervalInput.fill(from);
    await this.intervalInputRange.fill(to);
  }

  async save() {
    await this.saveBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }
}
