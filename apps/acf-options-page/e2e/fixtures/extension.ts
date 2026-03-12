/* eslint-disable react-hooks/rules-of-hooks */
import { workspaceRoot } from '@nx/devkit';
import { BrowserContext, test as base, chromium, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const extensionPath = path.join(workspaceRoot, 'apps/acf-extension/dist');

const isCI = !!process.env['CI'];
const extensionExists = fs.existsSync(extensionPath);
console.log('[fixture] workspaceRoot     :', workspaceRoot);
console.log('[fixture] extensionPath     :', extensionPath);
console.log('[fixture] extensionExists   :', extensionExists);
console.log('[fixture] CI flag           :', isCI);
if (extensionExists) {
  console.log('[fixture] dist contents     :', fs.readdirSync(extensionPath).join(', '));
} else {
  console.warn('[fixture] WARNING: extension dist folder not found — extension will NOT load');
}

export { expect };

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
      const ciArgs = isCI ? ['--headless=new', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'] : [];
      const args = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`, ...ciArgs];
      console.log('[fixture] chromium args     :', args);
      const context = await chromium.launchPersistentContext('', {
        // Must be false so Playwright doesn't inject --headless (old mode) which blocks extension loading.
        // CI passes --headless=new via args above, which is Chrome's native headless and supports extensions.
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
      // Register the listener immediately — before any async work — so we cannot miss
      // the 'serviceworker' event that may fire during or right after context creation.
      const swPromise = workerContext.waitForEvent('serviceworker', { timeout: 25000 }).catch(() => null);

      let worker = workerContext.serviceWorkers()[0];
      if (!worker) {
        // Opening a page nudges Chrome to finish registering the extension service worker
        // in containerised CI environments where it may not start automatically.
        const triggerPage = await workerContext.newPage();
        try {
          await triggerPage.goto('about:blank', { waitUntil: 'commit' }).catch(() => null);
        } finally {
          await triggerPage.close();
        }
        worker = workerContext.serviceWorkers()[0] ?? (await swPromise) ?? undefined;
      }

      if (!worker) {
        throw new Error(`[fixture] Extension service worker did not start within timeout.\n` + `  extensionPath: ${extensionPath}\n` + `  extensionExists: ${extensionExists}`);
      }

      const extensionId = worker.url().split('/')[2];
      console.log('[fixture] extensionId       :', extensionId);
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

  // Returns the extension service worker, waking it up if Chrome stopped it
  worker: async ({ workerContext, workerExtensionId }, use) => {
    let sw = workerContext.serviceWorkers()[0];
    if (!sw) {
      // Opening any extension page causes Chrome to restart the service worker
      const wakePage = await workerContext.newPage();
      try {
        await wakePage.goto(`chrome-extension://${workerExtensionId}/devtools.html`);
        sw = workerContext.serviceWorkers()[0] ?? (await workerContext.waitForEvent('serviceworker'));
      } catch (e) {
        console.warn('[fixture] WARNING: failed to wake service worker via devtools.html:', e);
      } finally {
        await wakePage.close();
      }
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
