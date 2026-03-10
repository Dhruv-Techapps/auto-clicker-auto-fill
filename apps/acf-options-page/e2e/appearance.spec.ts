import type { Page } from '@playwright/test';

import { expect, test } from './fixtures/extension';

const BASE_URL = 'http://localhost:4200';

const openThemeMenu = async (page: Page) => {
  await page.locator('#user-dropdown').click();
  await page.locator('.bi-palette').click();
};

const openLanguageMenu = async (page: Page) => {
  await page.locator('#user-dropdown').click();
  await page.locator('.bi-translate').click();
};

test.describe('Language and Theme change', () => {
  // Serial mode because tests share browser localStorage via the persistent worker context.
  test.describe.configure({ mode: 'serial' });

  test('should apply dark theme and persist after reload when dark theme is selected', async ({ page }) => {
    // Arrange
    await page.goto(`${BASE_URL}/automations`);

    // Act — open user dropdown, open theme submenu, select dark
    await openThemeMenu(page);
    await page.getByText('Dark', { exact: true }).click();

    // Assert — HTML element has dark theme attribute
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');

    // Assert — theme is persisted in localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('dark');

    // Act — reload and verify persistence
    await page.reload();

    // Assert — dark theme is still applied after reload
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  });

  test('should apply light theme and persist after reload when light theme is selected', async ({ page }) => {
    // Arrange
    await page.goto(`${BASE_URL}/automations`);

    // Act — open user dropdown, open theme submenu, select light
    await openThemeMenu(page);
    await page.getByText('Light', { exact: true }).click();

    // Assert — HTML element has light theme attribute
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');

    // Assert — theme is persisted in localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('light');

    // Act — reload and verify persistence
    await page.reload();

    // Assert — light theme is still applied after reload
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  });

  test('should store French language and persist after reload when French is selected', async ({ page }) => {
    // Arrange — ensure the UI starts in English for this test
    await page.goto(`${BASE_URL}/automations`);
    await page.evaluate(() => localStorage.setItem('language', 'en'));
    await page.reload();

    // Act — open user dropdown, open language submenu, select French
    await openLanguageMenu(page);
    await page.getByText('French', { exact: true }).click();

    // Assert — language is persisted in localStorage
    const storedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(storedLanguage).toBe('fr');

    // Act — reload and verify persistence
    await page.reload();

    // Assert — language is still French after reload
    const languageAfterReload = await page.evaluate(() => localStorage.getItem('language'));
    expect(languageAfterReload).toBe('fr');
  });

  test('should store English language and persist after reload when switching from French to English', async ({ page }) => {
    // Arrange — ensure the UI starts in French for this test
    await page.goto(`${BASE_URL}/automations`);
    await page.evaluate(() => localStorage.setItem('language', 'fr'));
    await page.reload();

    // Act — open user dropdown, open language submenu
    // Note: the UI is in French, so 'English' appears as 'Anglais' in the language list
    await openLanguageMenu(page);
    await page.getByText('Anglais', { exact: true }).click();

    // Assert — language is persisted in localStorage
    const storedLanguage = await page.evaluate(() => localStorage.getItem('language'));
    expect(storedLanguage).toBe('en');

    // Act — reload and verify persistence
    await page.reload();

    // Assert — language is still English after reload
    const languageAfterReload = await page.evaluate(() => localStorage.getItem('language'));
    expect(languageAfterReload).toBe('en');
  });
});
