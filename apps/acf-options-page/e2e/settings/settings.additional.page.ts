import type { Locator, Page } from '@playwright/test';
import { URLS } from '../fixtures/base-url';

export class SettingsAdditionalPage {
  readonly form: Locator;
  readonly checkiFrames: Locator;
  readonly reloadOnError: Locator;
  readonly statusBarHide: Locator;
  readonly statusBarTopLeft: Locator;
  readonly statusBarTopRight: Locator;
  readonly statusBarBottomLeft: Locator;
  readonly statusBarBottomRight: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(public readonly page: Page) {
    this.form = page.getByTestId('settings-additional-form');
    this.checkiFrames = page.getByTestId('settings-additional-checkiFrames');
    this.reloadOnError = page.getByTestId('settings-additional-reloadOnError');
    this.statusBarHide = page.getByTestId('settings-additional-statusBar-hide');
    this.statusBarTopLeft = page.getByTestId('settings-additional-statusBar-top-left');
    this.statusBarTopRight = page.getByTestId('settings-additional-statusBar-top-right');
    this.statusBarBottomLeft = page.getByTestId('settings-additional-statusBar-bottom-left');
    this.statusBarBottomRight = page.getByTestId('settings-additional-statusBar-bottom-right');
    this.saveBtn = page.getByTestId('settings-additional-save');
    this.cancelBtn = page.getByTestId('settings-additional-cancel');
  }

  async goto() {
    await this.page.goto(URLS.SETTINGS_ADDITIONAL);
  }

  async toggleCheckiFrames() {
    await this.checkiFrames.click();
  }

  async toggleReloadOnError() {
    await this.reloadOnError.click();
  }

  async selectStatusBar(location: string) {
    await this.page.getByTestId(`settings-additional-statusBar-${location}`).click();
  }

  async save() {
    await this.saveBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }
}
