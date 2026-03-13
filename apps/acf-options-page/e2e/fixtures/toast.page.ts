import { expect, type Locator, type Page } from '@playwright/test';

export type ToastVariant = 'success' | 'danger' | 'warning' | 'info';

export class ToastPage {
  readonly container: Locator;

  constructor(private readonly page: Page) {
    this.container = page.getByTestId('toast-container');
  }

  /** Returns the last visible toast matching the given Bootstrap variant. */
  item(variant: ToastVariant) {
    return this.page.locator(`[data-testid="toast-item"].bg-${variant}`).last();
  }

  /** Waits for a toast of the given variant to become visible, optionally asserting its header/body text. */
  async waitForToast(variant: ToastVariant, options: { header?: string; body?: string } = {}) {
    const toast = this.item(variant);
    await expect(toast).toBeVisible();
    if (options.header) {
      await expect(toast.locator('.toast-header strong')).toHaveText(options.header);
    }
    if (options.body) {
      await expect(toast.locator('.toast-body')).toHaveText(options.body);
    }
    return toast;
  }

  async waitForSuccess(options: { header?: string; body?: string } = {}) {
    return this.waitForToast('success', options);
  }

  async waitForError(options: { header?: string; body?: string } = {}) {
    return this.waitForToast('danger', options);
  }
}
