/* eslint-disable react-hooks/rules-of-hooks */
import { workspaceRoot } from '@nx/devkit';
import { test as base, chromium, expect } from '@playwright/test';
import * as path from 'path';

const extensionPath = path.join(workspaceRoot, 'apps/acf-extension/dist');

export { expect };

export const test = base.extend<{
  extensionId: string;
}>({
  // Override the default context to use a persistent context with the extension loaded
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
    });
    await use(context);
    await context.close();
  },

  // Resolve the extension ID from the background service worker
  extensionId: async ({ context }, use) => {
    let worker = context.serviceWorkers()[0];
    if (!worker) {
      worker = await context.waitForEvent('serviceworker');
    }
    const extensionId = worker.url().split('/')[2];
    await use(extensionId);
  },

  // Provide a page from the persistent context
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  }
});
