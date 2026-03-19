import type { Locator, Page } from '@playwright/test';
import { URLS } from '../../helpers/base-url';

export class SettingsNotificationsPage {
  readonly container: Locator;
  readonly onError: Locator;
  readonly onAction: Locator;
  readonly onBatch: Locator;
  readonly onConfig: Locator;
  readonly sound: Locator;

  constructor(public readonly page: Page) {
    this.container = page.getByTestId('settings-notifications');
    this.onError = page.getByTestId('settings-notification-onError');
    this.onAction = page.getByTestId('settings-notification-onAction');
    this.onBatch = page.getByTestId('settings-notification-onBatch');
    this.onConfig = page.getByTestId('settings-notification-onConfig');
    this.sound = page.getByTestId('settings-notification-sound');
  }

  async goto() {
    await this.page.goto(URLS.SETTINGS_NOTIFICATION);
  }

  async toggleOnError() {
    await this.onError.click();
  }

  async toggleOnAction() {
    await this.onAction.click();
  }

  async toggleOnBatch() {
    await this.onBatch.click();
  }

  async toggleOnConfig() {
    await this.onConfig.click();
  }

  async toggleSound() {
    await this.sound.click();
  }
}
