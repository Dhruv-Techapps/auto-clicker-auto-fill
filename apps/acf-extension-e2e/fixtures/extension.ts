import { BrowserContext, chromium, test as base } from '@playwright/test';
import path from 'path';

// Points at the webpack build output for the extension
const EXTENSION_PATH = path.resolve(
  __dirname,
  '../../../../dist/apps/acf-extension',
);

/**
 * Custom fixture that:
 *  - Launches a persistent Chromium context with the unpacked extension loaded
 *  - Resolves the extension ID dynamically from the service worker URL
 *    (never hardcoded — safe across builds and machines)
 */
export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      // MV3 extensions cannot be loaded in true headless mode
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
    });
    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    // Wait for the MV3 service worker and extract the extension ID from its URL
    // Service worker URL format: chrome-extension://<id>/background.js
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export { expect } from '@playwright/test';
