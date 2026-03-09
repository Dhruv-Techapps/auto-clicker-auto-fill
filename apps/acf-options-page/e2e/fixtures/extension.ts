/* eslint-disable react-hooks/rules-of-hooks */
import { workspaceRoot } from '@nx/devkit';
import { BrowserContext, test as base, chromium, expect } from '@playwright/test';
import * as path from 'path';

const extensionPath = path.join(workspaceRoot, 'apps/acf-extension/dist');

export { expect };

// Worker-scoped fixtures are shared across all tests in the same worker process.
// Test-scoped fixtures are created fresh for each individual test.
type WorkerFixtures = {
  workerContext: BrowserContext;
  workerExtensionId: string;
};

type TestFixtures = {
  extensionId: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Single browser instance shared across all tests in the worker
  workerContext: [
    async ({}, use) => {
      const context = await chromium.launchPersistentContext('', {
        // headless must be false to allow extension loading.
        // In CI, pass --headless=new so Chrome runs without a display (Chrome 112+).
        headless: false,
        args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`, ...(process.env['CI'] ? ['--headless=new'] : [])]
      });
      await use(context);
      await context.close();
    },
    { scope: 'worker' }
  ],

  // Extension ID resolved once and shared across all tests
  workerExtensionId: [
    async ({ workerContext }, use) => {
      let worker = workerContext.serviceWorkers()[0];
      if (!worker) {
        worker = await workerContext.waitForEvent('serviceworker');
      }
      await use(worker.url().split('/')[2]);
    },
    { scope: 'worker' }
  ],

  // Expose the shared context as the standard 'context' fixture
  context: async ({ workerContext }, use) => {
    await use(workerContext);
  },

  // Expose the shared extension ID as the standard 'extensionId' fixture
  extensionId: async ({ workerExtensionId }, use) => {
    await use(workerExtensionId);
  },

  // Fresh page per test — closed automatically after each test
  page: async ({ workerContext }, use) => {
    const page = await workerContext.newPage();
    await use(page);
    await page.close();
  }
});
