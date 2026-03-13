import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Extensions require serial execution
  reporter: [
    ['github', { outputFile: 'test-output/playwright/report/results.json' }],
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
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium'
    }
  ]
});
