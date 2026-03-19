import type { Locator, Page } from '@playwright/test';
import { URLS } from '../../helpers/base-url';

export class SettingsPage {
  readonly nav: Locator;
  readonly navRetry: Locator;
  readonly navNotification: Locator;
  readonly navBackup: Locator;
  readonly navGoogleSheets: Locator;
  readonly navAdditional: Locator;

  // Notification section parent
  readonly notificationsContainer: Locator;
  // Additional section parent
  readonly additionalForm: Locator;

  constructor(public readonly page: Page) {
    this.nav = page.getByTestId('settings-nav');
    this.navRetry = page.getByTestId('settings-nav-retry');
    this.navNotification = page.getByTestId('settings-nav-notification');
    this.navBackup = page.getByTestId('settings-nav-backup');
    this.navGoogleSheets = page.getByTestId('settings-nav-google-sheets');
    this.navAdditional = page.getByTestId('settings-nav-additional');

    this.notificationsContainer = page.getByTestId('settings-notifications');
    this.additionalForm = page.getByTestId('settings-additional-form');
  }

  async goto() {
    await this.page.goto(URLS.SETTINGS);
  }

  async navigateTo(section: 'retry' | 'notification' | 'backup' | 'google-sheets' | 'additional') {
    const map = {
      retry: this.navRetry,
      notification: this.navNotification,
      backup: this.navBackup,
      'google-sheets': this.navGoogleSheets,
      additional: this.navAdditional
    };
    await map[section].click();
  }
}
