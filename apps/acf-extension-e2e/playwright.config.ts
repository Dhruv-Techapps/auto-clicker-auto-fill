import { defineConfig } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  // Extension tests must not run in parallel — persistent contexts share state
  fullyParallel: false,
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        // Extensions require a real browser binary (not a bundled playwright binary)
        channel: 'chromium',
      },
    },
  ],
});
