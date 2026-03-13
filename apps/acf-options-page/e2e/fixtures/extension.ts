/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect as baseExpect, BrowserContext, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const isCI = !!process.env['CI'];

/**
 * Clean session files that might cause hangs
 * @param {string} tmpDir - Temp directory path
 */
function cleanSessionFiles(tmpDir: string) {
  const sessionFiles = [path.join(tmpDir, 'sessionstore-backups'), path.join(tmpDir, 'sessionCheckpoints.json'), path.join(tmpDir, 'sessionstore.jsonlz4')];
  for (const file of sessionFiles) {
    if (fs.existsSync(file)) {
      fs.rmSync(file, { recursive: true, force: true });
    }
  }
}

// Worker-scoped fixtures are shared across all tests in the same worker process.
// Test-scoped fixtures are created fresh for each individual test.
interface WorkerFixtures {
  context: BrowserContext;
  extensionId: string;
}

export const test = base.extend<WorkerFixtures>({
  // Expose the shared context as the standard 'context' fixture
  context: async ({}, use) => {
    const pathToExtension = path.resolve(__dirname, '../../../../apps/acf-extension/dist');
    let context;
    // Validate extension exists before attempting to load
    console.log('[Fixture] Extension path:', pathToExtension);
    if (!fs.existsSync(pathToExtension)) {
      throw new Error(`Extension path does not exist: ${pathToExtension}`);
    }
    const manifestPath = path.join(pathToExtension, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`manifest.json not found in: ${pathToExtension}`);
    }
    console.log('[Fixture] ✓ Extension validated');
    console.log('[Fixture] Extension files:', fs.readdirSync(pathToExtension).slice(0, 10).join(', '));

    // Chromium extension loading - MUST use launchPersistentContext
    // Extensions ONLY work with persistent contexts in Playwright
    // Research confirms: browser.launch() + newContext() does NOT support extensions
    console.log('[Fixture] Using launchPersistentContext (required for extensions)');

    // Use unique temp directory for isolation
    const tmpDir = fs.mkdtempSync(path.join('/tmp', 'playwright-chrome-'));

    console.log('[Fixture] Temp directory:', tmpDir);

    // Clean any existing session state that might cause hangs
    try {
      cleanSessionFiles(tmpDir);
      console.log('[Fixture] Cleaned session state files');
    } catch (_error) {
      console.log('[Fixture] No session files to clean (fresh start)');
    }

    console.log('[Fixture] Launching Chromium persistent context...');
    console.log('headless:', isCI);
    context = await chromium
      .launchPersistentContext('', {
        headless: false, // Headless in CI (no X server), headed locally for debugging
        args: [
          '--headless=new', // Use new headless mode for better extension support
          // Extension loading (REQUIRED - must be first)
          `--disable-extensions-except=${pathToExtension}`,
          `--load-extension=${pathToExtension}`,
          '--no-first-run',
          '--disable-default-apps'
        ]
      })
      .catch((error) => {
        console.error('[Fixture] ✗ Browser launch failed:', error.message);
        console.error('[Fixture] Extension path was:', pathToExtension);
        console.error('[Fixture] Temp directory was:', tmpDir);
        console.error('[Fixture] Full error:', error.stack);
        throw error;
      });
    console.log('[Fixture] Chromium persistent context created with extension');

    // Set the server URL and notify background service worker
    const extensionId = await getExtensionId(context);
    console.log('[Fixture] Detected extension ID:', extensionId);
    const setupPage = await context.newPage();
    await setupPage.goto(`chrome-extension://${extensionId}/options.html`);
    await setupPage.waitForTimeout(1000);
    await setupPage.close();

    await use(context);

    // Aggressive cleanup with hard 5-second timeout (research-recommended)
    try {
      // Close all pages first (non-blocking)
      const pages = context.pages();
      await Promise.all(pages.map((page) => page.close().catch(() => {})));

      // Force close context with 5-second hard timeout
      await Promise.race([context.close(), new Promise((_, reject) => setTimeout(() => reject(new Error('Context close timeout')), 5000))]);
      console.log('[Fixture] Context closed successfully');
    } catch (error) {
      if (error instanceof Error) console.warn('[Fixture] Context cleanup error:', error.message);
      else console.warn(error);
      // Don't rethrow - let the browser process die naturally
      // Worker will clean up remaining processes
    }
  },

  // Expose the shared extension ID as the standard 'extensionId' fixture
  extensionId: async ({ context }, use) => {
    // Chromium extension ID extraction from service worker
    try {
      let background = context.serviceWorkers()[0];
      if (!background) {
        // Wait for service worker with timeout
        background = await context.waitForEvent('serviceworker');
      }

      const extensionId = background.url().split('/')[2];
      console.log('[Fixture] Extension ID:', extensionId);
      await use(extensionId);
    } catch (error) {
      if (error instanceof Error) console.warn('[Fixture] Could not detect extension ID:', error.message);
      else console.warn(error);
      // Use a placeholder if service worker detection fails
      await use('unknown-extension-id');
    }
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  }
});

/**
 * Get the extension ID from a browser context with the extension loaded
 */
async function getExtensionId(context: BrowserContext) {
  // Navigate to chrome://extensions to find the ID
  let [background] = context.serviceWorkers();
  if (!background) {
    background = await context.waitForEvent('serviceworker');
  }
  const extensionId = background.url().split('/')[2];
  return extensionId;
}

export const expect = baseExpect;
