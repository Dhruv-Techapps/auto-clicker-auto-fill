import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig } from '@playwright/test';
import { BASE_URL } from './e2e/fixtures/base-url';

const config = nxE2EPreset(__filename, { testDir: './e2e' });
console.log('[Playwright Config] Base URL:', config);
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Extensions require serial execution
  reporter: [
    ['dot'],
    ...(process.env['CI'] ? [['list'] as ['list']] : []),
    ...(process.env['CI'] ? [['github'] as ['github']] : []),
    [
      'html',
      {
        open: 'never',
        outputFolder: 'test-output/playwright/report',
        host: process.env['CI'] ? 'auto-clicker-auto-fill-playwright.web.app' : 'localhost'
      }
    ]
  ],
  timeout: 30_000,
  use: {
    channel: 'chromium', // use full Chrome binary, not headless-shell (headless-shell does not support extensions)
    trace: 'on-first-retry',
    screenshot: 'on'
  },
  webServer: {
    command: process.env['CI'] ? '' : 'npm run start',
    url: BASE_URL,
    reuseExistingServer: !!process.env['CI'],
    cwd: workspaceRoot
  },
  projects: [
    {
      name: 'chromium'
    }
  ]
});
