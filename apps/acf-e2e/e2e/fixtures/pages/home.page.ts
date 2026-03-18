import { Page } from '@playwright/test';
import { URLS } from '../base-url';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(URLS.HOME);
  }

  async openNewUrl(url: string) {
    await this.page.context().newPage();
    await this.page.goto(url);
  }
}
