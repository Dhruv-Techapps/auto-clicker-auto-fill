import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';

const config = nxE2EPreset(__filename, { testDir: './e2e' });

export default defineConfig({
  ...config,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    ...(process.env['CI'] ? [['github'] as ['github']] : []),
    [
      'html',
      {
        open: process.env['CI'] ? 'never' : 'always',
        outputFolder: 'test-output/playwright/report',
        host: process.env['CI'] ? 'auto-clicker-auto-fill-playwright.web.app' : 'localhost'
      }
    ]
  ],
  timeout: 30_000,
  use: {
    channel: 'chromium', // use full Chrome binary, not headless-shell (headless-shell does not support extensions)
    trace: 'on-first-retry',
    screenshot: process.env['CI'] ? 'on' : 'off'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
