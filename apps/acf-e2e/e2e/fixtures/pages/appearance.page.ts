import type { Page } from '@playwright/test';
import { URLS } from '../base-url';

export class AppearancePage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto(URLS.HOME);
  }

  async openThemeMenu() {
    await this.page.locator('#user-dropdown').click();
    await this.page.locator('.bi-palette').click();
  }

  async openLanguageMenu() {
    await this.page.locator('#user-dropdown').click();
    await this.page.locator('.bi-translate').click();
  }

  async selectTheme(theme: 'Dark' | 'Light' | 'Auto') {
    await this.openThemeMenu();
    await this.page.getByText(theme, { exact: true }).click();
  }

  async selectLanguage(label: string) {
    await this.openLanguageMenu();
    await this.page.getByText(label, { exact: true }).click();
  }

  async getStoredTheme() {
    return this.page.evaluate(() => localStorage.getItem('theme'));
  }

  async getStoredLanguage() {
    return this.page.evaluate(() => localStorage.getItem('language'));
  }

  async setStoredLanguage(lang: string) {
    await this.page.evaluate((l) => localStorage.setItem('language', l), lang);
  }
}
