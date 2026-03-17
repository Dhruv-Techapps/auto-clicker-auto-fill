import { expect, pageTest as test } from './fixtures';

test.describe('Language and Theme change', () => {
  test('should apply dark theme and persist after reload when dark theme is selected', async ({ homePage }) => {
    // Arrange
    await homePage.goto();

    // Act
    await homePage.selectTheme('Dark');

    // Assert — HTML element has dark theme attribute
    await expect(homePage.page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');

    // Assert — theme is persisted in localStorage
    expect(await homePage.getStoredTheme()).toBe('dark');

    // Act — reload and verify persistence
    await homePage.page.reload();

    // Assert — dark theme is still applied after reload
    await expect(homePage.page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  });

  test('should apply light theme and persist after reload when light theme is selected', async ({ homePage }) => {
    // Arrange
    await homePage.goto();

    // Act
    await homePage.selectTheme('Light');

    // Assert — HTML element has light theme attribute
    await expect(homePage.page.locator('html')).toHaveAttribute('data-bs-theme', 'light');

    // Assert — theme is persisted in localStorage
    expect(await homePage.getStoredTheme()).toBe('light');

    // Act — reload and verify persistence
    await homePage.page.reload();

    // Assert — light theme is still applied after reload
    await expect(homePage.page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  });

  test('should store French language and persist after reload when French is selected', async ({ homePage }) => {
    // Arrange — ensure the UI starts in English for this test
    await homePage.goto();
    await homePage.setStoredLanguage('en');
    await homePage.page.reload();

    // Act
    await homePage.selectLanguage('French');

    // Assert — language is persisted in localStorage
    expect(await homePage.getStoredLanguage()).toBe('fr');

    // Act — reload and verify persistence
    await homePage.page.reload();

    // Assert — language is still French after reload
    expect(await homePage.getStoredLanguage()).toBe('fr');
  });

  test('should store English language and persist after reload when switching from French to English', async ({ homePage }) => {
    // Arrange — ensure the UI starts in French for this test
    await homePage.goto();
    await homePage.setStoredLanguage('fr');
    await homePage.page.reload();

    // Act — Note: the UI is in French, so 'English' appears as 'Anglais'
    await homePage.selectLanguage('Anglais');

    // Assert — language is persisted in localStorage
    expect(await homePage.getStoredLanguage()).toBe('en');

    // Act — reload and verify persistence
    await homePage.page.reload();

    // Assert — language is still English after reload
    expect(await homePage.getStoredLanguage()).toBe('en');
  });
});
