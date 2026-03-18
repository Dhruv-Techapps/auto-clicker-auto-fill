import { expect, pageTest as test } from './fixtures';

test.describe('Language and Theme change', () => {
  test('should apply dark theme and persist after reload when dark theme is selected', async ({ page, homePage, appearancePage }) => {
    // Arrange
    await homePage.goto();

    // Act
    await appearancePage.selectTheme('Dark');

    // Assert — HTML element has dark theme attribute
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');

    // Assert — theme is persisted in localStorage
    expect(await appearancePage.getStoredTheme()).toBe('dark');

    // Act — reload and verify persistence
    await page.reload();

    // Assert — dark theme is still applied after reload
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  });

  test('should apply light theme and persist after reload when light theme is selected', async ({ page, homePage, appearancePage }) => {
    // Arrange
    await homePage.goto();

    // Act
    await appearancePage.selectTheme('Light');

    // Assert — HTML element has light theme attribute
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');

    // Assert — theme is persisted in localStorage
    expect(await appearancePage.getStoredTheme()).toBe('light');

    // Act — reload and verify persistence
    await page.reload();

    // Assert — light theme is still applied after reload
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  });

  test('should store French language and persist after reload when French is selected', async ({ page, homePage, appearancePage }) => {
    // Arrange — ensure the UI starts in English for this test
    await homePage.goto();
    await appearancePage.setStoredLanguage('en');
    await page.reload();

    // Act
    await appearancePage.selectLanguage('French');

    // Assert — language is persisted in localStorage
    expect(await appearancePage.getStoredLanguage()).toBe('fr');

    // Act — reload and verify persistence
    await page.reload();

    // Assert — language is still French after reload
    expect(await appearancePage.getStoredLanguage()).toBe('fr');
  });

  test('should store English language and persist after reload when switching from French to English', async ({ page, homePage, appearancePage }) => {
    // Arrange — ensure the UI starts in French for this test
    await homePage.goto();
    await appearancePage.setStoredLanguage('fr');
    await page.reload();

    // Act — Note: the UI is in French, so 'English' appears as 'Anglais'
    await appearancePage.selectLanguage('Anglais');

    // Assert — language is persisted in localStorage
    expect(await appearancePage.getStoredLanguage()).toBe('en');

    // Act — reload and verify persistence
    await page.reload();

    // Assert — language is still English after reload
    expect(await appearancePage.getStoredLanguage()).toBe('en');
  });
});
