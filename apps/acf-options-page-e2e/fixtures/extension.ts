import { test as base } from '@playwright/test';

// The options-page fixture is a plain Playwright test — no extension loading needed.
// Re-export test & expect so all test files import exclusively from this fixture,
// never directly from @playwright/test.
export const test = base.extend({});
export { expect } from '@playwright/test';
