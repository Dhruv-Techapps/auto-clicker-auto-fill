/* eslint-disable react-hooks/rules-of-hooks */
import { IConfiguration, ISettings, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { workspaceRoot } from '@nx/devkit';
import { test as base, BrowserContext, chromium, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const extensionPath = path.join(workspaceRoot, 'apps/acf-extension/dist');
if (!fs.existsSync(extensionPath)) {
  throw new Error(`Extension path does not exist: ${extensionPath}`);
}
const manifestPath = path.join(extensionPath, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  throw new Error(`manifest.json not found in: ${extensionPath}`);
}

const isCI = !!process.env['CI'];

// Worker-scoped fixtures are shared across all tests in the same worker process.
// Test-scoped fixtures are created fresh for each individual test.
export interface WorkerFixtures {
  workerContext: BrowserContext;
  workerExtensionId: string;
}

export interface TestFixtures {
  extensionId: string;
  getSettings: () => Promise<ISettings>;
  getAutomations: () => Promise<IConfiguration[]>;

  worker: Awaited<ReturnType<BrowserContext['serviceWorkers']>>[number];
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Single browser instance shared across all tests in the worker
  workerContext: [
    async ({}, use) => {
      const ciArgs = isCI ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : [];
      const args = ['--headless=new', `--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`, '--no-first-run', '--disable-default-apps', ...ciArgs];
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
      const extensionId = worker.url().split('/')[2];
      await use(extensionId);
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

  getSettings: async ({ worker }, use) => {
    await use(() => worker.evaluate<ISettings, string>((key) => chrome.storage.local.get(key).then((r) => r[key] as ISettings), LOCAL_STORAGE_KEY.SETTINGS));
  },

  getAutomations: async ({ worker }, use) => {
    await use(() => worker.evaluate<IConfiguration[], string>((key) => chrome.storage.local.get(key).then((r) => r[key] as IConfiguration[]), LOCAL_STORAGE_KEY.CONFIGS));
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

export { expect };
