/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, chromium, expect } from '@playwright/test';

export { expect };

interface TestFixtures {
  extensionId: string;
}

export const test = base.extend<TestFixtures>({
  context: async ({ launchOptions }, use) => {
    const context = await chromium.launchPersistentContext('', {
      ...launchOptions,
      headless: true,
      channel: 'chromium'
    });

    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }

    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  }
});
