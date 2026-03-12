import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const pathToExtension = path.resolve(__dirname, '../../acf-extension/dist');

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    console.log('[Fixture] Extension path:', pathToExtension);
    console.log('[Fixture] Extension path exists:', fs.existsSync(pathToExtension));
    if (fs.existsSync(pathToExtension)) {
      console.log('[Fixture] Extension path contents:', fs.readdirSync(pathToExtension));
    }

    const context = await chromium.launchPersistentContext('', {
      headless: true,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--no-first-run',
        '--disable-default-apps'
      ]
    });

    console.log('[Fixture] Browser launched');

    // Wait for the extension service worker to start
    let [sw] = context.serviceWorkers();
    console.log('[Fixture] Service workers at launch:', context.serviceWorkers().length);
    if (!sw) {
      console.log('[Fixture] Waiting for serviceworker event...');
      sw = await context.waitForEvent('serviceworker');
    }
    console.log('[Fixture] Service worker URL:', sw.url());

    // The extension opens welcome + options pages on first install.
    // Wait for them to appear, then close them all so tests start clean.
    const deadline = Date.now() + 3000;
    while (context.pages().length < 2 && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 200));
    }

    // Close all auto-opened pages
    for (const p of context.pages()) {
      await p.close().catch(() => {});
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
    console.log('[Fixture] Detected extension ID:', extensionId);
    console.log('[Fixture] Extension path used:', pathToExtension);
    await use(extensionId);
  }
});

export const expect = test.expect;