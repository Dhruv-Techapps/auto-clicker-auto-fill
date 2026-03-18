import type { Locator, Page } from '@playwright/test';
import { URLS } from '../base-url';

export class SidebarPage {
  readonly addAutomationButton: Locator;
  readonly automationList: Locator;
  readonly userDropdown: Locator;

  constructor(public readonly page: Page) {
    this.addAutomationButton = this.page.getByTestId('sidebar-add-automation');
    this.automationList = this.page.locator('[data-testid="sidebar-automation-list"]');
    this.userDropdown = this.page.locator('#user-dropdown');
  }

  async goto() {
    await this.page.goto(URLS.HOME);
  }

  async addNewAutomation() {
    await this.addAutomationButton.click();
  }

  async gotoAutomationsPage() {
    await this.page.getByRole('link', { name: /automations/i }).click();
  }

  async selectFooterOption(optionText: string) {
    await this.userDropdown.click();
    await this.page.getByText(optionText, { exact: true }).click();
  }

  async getAutomationByUrl(url: string) {
    return this.page.locator(`[data-testid="sidebar-automation-item"][data-url="${url}"]`);
  }
}
