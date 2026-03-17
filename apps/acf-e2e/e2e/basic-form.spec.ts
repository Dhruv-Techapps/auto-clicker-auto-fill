import { test, expect } from '@playwright/test';

// Test site URL
const TEST_SITE_URL = 'https://test.getautoclicker.com';

// Basic form selectors (update as needed for your test site)
const FORM_INPUT_SELECTOR = 'input[name="username"]';
const FORM_PASSWORD_SELECTOR = 'input[name="password"]';

test.describe('Basic Form Autofill by Extension', () => {
  test('should autofill form fields when site is opened', async ({ page }) => {
    await page.goto(TEST_SITE_URL);

    // Wait for autofill to happen (extension should fill fields)
    await page.waitForTimeout(1000); // Adjust if needed

    // Assert fields are filled
    await expect(page.locator(FORM_INPUT_SELECTOR)).toHaveValue('testuser');
    await expect(page.locator(FORM_PASSWORD_SELECTOR)).toHaveValue('testpass');
  });
});
