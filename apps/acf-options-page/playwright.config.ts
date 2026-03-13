import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './e2e/fixtures/base-url';

const config = nxE2EPreset(__filename, { testDir: './e2e' });

export default defineConfig({
  ...config,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['dot'],
    ['list'],
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
    baseURL: BASE_URL,
    channel: 'chromium', // use full Chrome binary, not headless-shell (headless-shell does not support extensions)
    trace: 'on-first-retry',
    screenshot: process.env['CI'] ? 'on' : 'off'
  },
  webServer: {
    command: process.env['CI'] ? '' : 'npm run start',
    url: BASE_URL,
    reuseExistingServer: !!process.env['CI'],
    cwd: workspaceRoot
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
