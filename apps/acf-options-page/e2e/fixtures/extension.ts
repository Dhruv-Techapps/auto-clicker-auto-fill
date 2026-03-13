/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect as baseExpect, BrowserContext, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const extensionPath = path.resolve(__dirname, '../../../../apps/acf-extension/dist');
const isCI = !!process.env['CI'];

// Worker-scoped fixtures are shared across all tests in the same worker process.
// Test-scoped fixtures are created fresh for each individual test.
interface WorkerFixtures {
  workerContext: BrowserContext;
  workerExtensionId: string;
}

interface TestFixtures {
  extensionId: string;
  worker: Awaited<ReturnType<BrowserContext['serviceWorkers']>>[number];
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Single browser instance shared across all tests in the worker
  workerContext: [
    async ({}, use) => {
      console.log('[Fixture] Extension path:', extensionPath);
      if (!fs.existsSync(extensionPath)) {
        throw new Error(`Extension path does not exist: ${extensionPath}`);
      }
      const manifestPath = path.join(extensionPath, 'manifest.json');
      if (!fs.existsSync(manifestPath)) {
        throw new Error(`manifest.json not found in: ${extensionPath}`);
      }
      console.log('[Fixture] ✓ Extension validated');
      console.log('[Fixture] Extension files:', fs.readdirSync(extensionPath).slice(0, 10).join(', '));

      const ciArgs = isCI ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : [];
      const args = ['--headless=new', `--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`, '--no-first-run', '--disable-default-apps', ...ciArgs];
      console.log('[Fixture] chromium args:', args);
      const context = await chromium.launchPersistentContext('', {
        headless: false,
        args
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

  // Returns the extension service worker, waking it up if Chrome stopped it
  worker: async ({ workerContext, workerExtensionId }, use) => {
    let sw = workerContext.serviceWorkers()[0];
    if (!sw) {
      const wakePage = await workerContext.newPage();
      await wakePage.goto(`chrome-extension://${workerExtensionId}/devtools.html`);
      sw = workerContext.serviceWorkers()[0] ?? (await workerContext.waitForEvent('serviceworker'));
      await wakePage.close();
    }
    await use(sw);
  },

  // Fresh page per test — closed automatically after each test
  page: async ({ workerContext }, use) => {
    const page = await workerContext.newPage();
    await use(page);
    await page.close();
  }
});

export const expect = baseExpect;
