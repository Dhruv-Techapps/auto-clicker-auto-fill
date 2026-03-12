import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';
import * as path from 'path';
import { BASE_URL } from './e2e/fixtures/base-url';

const config = nxE2EPreset(__filename, { testDir: './e2e' });
const extensionPath = path.join(workspaceRoot, 'apps/acf-extension/dist');
const isCI = !!process.env['CI'];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...config,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'test-output/playwright/report', host: isCI ? 'auto-clicker-auto-fill-playwright.web.app' : 'localhost' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: isCI ? 'on' : 'off'
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: isCI ? '' : 'npm run start',
    url: BASE_URL,
    reuseExistingServer: isCI,
    cwd: workspaceRoot
  },
  projects: [
    {
      name: 'chromium'
    }
  ]
});
