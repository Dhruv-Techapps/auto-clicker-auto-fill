import { expect, pageTest as test } from './fixtures';

const REORDER_URL_REGEX = /\/automations\/reorder/;

test.describe('Automations page rendering', () => {
  test('should display My Automations heading when navigating to automations page', async ({ automationsPage }) => {
    // Arrange

    // Assert
    await expect(automationsPage.heading).toBeVisible();
  });

  test('should display search input when navigating to automations page', async ({ automationsPage }) => {
    // Arrange

    // Assert
    await expect(automationsPage.searchInput).toBeVisible();
  });

  test('should display New and Import buttons when navigating to automations page', async ({ automationsPage }) => {
    // Arrange

    // Assert
    await expect(automationsPage.addButton).toBeVisible();
    await expect(automationsPage.importButton).toBeVisible();
  });

  test('should display automations count text when navigating to automations page', async ({ automationsPage }) => {
    // Arrange

    // Assert — the "N automations within extension" text is shown
    await expect(automationsPage.automationsCount).toBeVisible();
  });

  test('should display Select and Reorder buttons in normal mode', async ({ automationsPage }) => {
    // Arrange

    // Assert
    await expect(automationsPage.selectButton).toBeVisible();
    await expect(automationsPage.reorderButton).toBeVisible();
  });

  test('should display pre-loaded automation list items on initial load', async ({ automationsPage }) => {
    // Arrange

    // Assert — at least one list item is rendered
    await expect(automationsPage.listItems.first()).toBeVisible();
    expect(await automationsPage.listItems.count()).toBeGreaterThan(0);
  });
});

test.describe('Automations page search', () => {
  test('should filter automations by name when search term is entered', async ({ automationsPage }) => {
    // Arrange

    const totalBefore = await automationsPage.listItems.count();
    expect(totalBefore).toBeGreaterThan(1);

    // Act
    await automationsPage.searchInput.fill('Google Sheets');

    // Assert — only the matching automation is shown
    await expect(automationsPage.listItems).toHaveCount(1);
    await expect(automationsPage.container.getByText('Sample Automation | Google Sheets')).toBeVisible();
  });

  test('should filter automations by URL when search term matches URL', async ({ automationsPage }) => {
    // Arrange

    // Act — ?ab=12 appears only in the "Query Param" demo automation URL
    await automationsPage.searchInput.fill('?ab=12');

    // Assert
    await expect(automationsPage.listItems).toHaveCount(1);
    await expect(automationsPage.container.getByText('Sample Automation | Query Param')).toBeVisible();
  });

  test('should restore full list when search is cleared', async ({ automationsPage }) => {
    // Arrange

    const totalBefore = await automationsPage.listItems.count();
    await automationsPage.searchInput.fill('Google Sheets');
    await expect(automationsPage.listItems).toHaveCount(1);

    // Act
    await automationsPage.searchInput.fill('');

    // Assert — all items are visible again
    await expect(automationsPage.listItems).toHaveCount(totalBefore);
  });

  test('should show no items when search term matches nothing', async ({ automationsPage }) => {
    // Arrange

    // Act
    await automationsPage.searchInput.fill('zzz-no-match-zzz');

    // Assert
    await expect(automationsPage.listItems).toHaveCount(0);
  });
});

test.describe('Automations page selection mode', () => {
  test('should enter selection mode when Select button is clicked', async ({ automationsPage }) => {
    // Arrange

    // Act
    await automationsPage.enterSelectionMode();

    // Assert — selection controls appear
    await expect(automationsPage.selectAllCheckbox).toBeVisible();
    await expect(automationsPage.exportButton).toBeVisible();
    await expect(automationsPage.deleteButton).toBeVisible();
    await expect(automationsPage.cancelButton).toBeVisible();
  });

  test('should exit selection mode when cancel button is clicked', async ({ automationsPage }) => {
    // Arrange

    await automationsPage.enterSelectionMode();
    await expect(automationsPage.selectAllCheckbox).toBeVisible();

    // Act
    await automationsPage.exitSelectionMode();

    // Assert — normal mode is restored
    await expect(automationsPage.selectButton).toBeVisible();
    await expect(automationsPage.selectAllCheckbox).not.toBeVisible();
  });

  test('should disable export and delete buttons when no automations are selected', async ({ automationsPage }) => {
    // Arrange

    // Act
    await automationsPage.enterSelectionMode();

    // Assert
    await expect(automationsPage.exportButton).toBeDisabled();
    await expect(automationsPage.deleteButton).toBeDisabled();
  });

  test('should enable export and delete buttons when an automation is selected', async ({ automationsPage }) => {
    // Arrange

    await automationsPage.enterSelectionMode();

    // Act — check the first item checkbox
    await automationsPage.itemCheckboxes().first().check();

    // Assert
    await expect(automationsPage.exportButton).toBeEnabled();
    await expect(automationsPage.deleteButton).toBeEnabled();
  });

  test('should toggle automation selection off when checkbox is unchecked', async ({ automationsPage }) => {
    // Arrange

    await automationsPage.enterSelectionMode();
    await automationsPage.itemCheckboxes().first().check();
    await expect(automationsPage.exportButton).toBeEnabled();

    // Act — uncheck the item
    await automationsPage.itemCheckboxes().first().uncheck();

    // Assert — buttons become disabled again
    await expect(automationsPage.exportButton).toBeDisabled();
    await expect(automationsPage.deleteButton).toBeDisabled();
  });

  test('should select all automations when select-all checkbox is clicked', async ({ automationsPage }) => {
    // Arrange

    await automationsPage.enterSelectionMode();
    const checkboxes = automationsPage.itemCheckboxes();
    const total = await checkboxes.count();
    expect(total).toBeGreaterThan(0);

    // Act
    await automationsPage.selectAllCheckbox.click();

    // Assert — all item checkboxes are checked
    for (let i = 0; i < total; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
    await expect(automationsPage.exportButton).toBeEnabled();
    await expect(automationsPage.deleteButton).toBeEnabled();
  });

  test('should deselect all automations when select-all is clicked a second time', async ({ automationsPage }) => {
    // Arrange

    await automationsPage.enterSelectionMode();
    await automationsPage.selectAllCheckbox.click();
    const checkboxes = automationsPage.itemCheckboxes();
    await expect(automationsPage.exportButton).toBeEnabled();

    // Act — click select-all again to deselect
    await automationsPage.selectAllCheckbox.click();

    // Assert — all item checkboxes are unchecked
    const total = await checkboxes.count();
    for (let i = 0; i < total; i++) {
      await expect(checkboxes.nth(i)).not.toBeChecked();
    }
    await expect(automationsPage.exportButton).toBeDisabled();
    await expect(automationsPage.deleteButton).toBeDisabled();
  });
});

test.describe('Automations page export', () => {
  test('should show export success toast when exporting selected automations', async ({ automationsPage, toastPage }) => {
    // Arrange

    await automationsPage.enterSelectionMode();
    await automationsPage.itemCheckboxes().first().check();

    // Act
    await automationsPage.exportButton.click();

    // Assert — toast with "Automations" header appears
    await toastPage.waitForToast('success', { header: 'Automations' });
  });

  test('should export multiple selected automations and show count in toast body', async ({ automationsPage, toastPage }) => {
    // Arrange

    await automationsPage.enterSelectionMode();

    // Select first two items
    await automationsPage.itemCheckboxes().nth(0).check();
    await automationsPage.itemCheckboxes().nth(1).check();

    // Act
    await automationsPage.exportButton.click();

    // Assert — toast mentions the plural export message
    const toast = await toastPage.waitForToast('success', { header: 'Automations' });
    await expect(toast.locator('.toast-body')).toContainText('exported successfully');
  });
});

test.describe('Automations page delete', () => {
  test('should delete selected automation and reduce list count by one', async ({ automationsPage, toastPage }) => {
    // Arrange

    const initialCount = await automationsPage.listItems.count();
    expect(initialCount).toBeGreaterThan(0);
    await automationsPage.enterSelectionMode();

    // Act — select the first item and delete
    await automationsPage.itemCheckboxes().first().check();
    await automationsPage.deleteButton.click();

    // Assert — list has one fewer item
    await expect(automationsPage.listItems).toHaveCount(initialCount - 1);

    // Assert — success toast appears
    await toastPage.waitForToast('success', { header: 'Automations' });
  });
});

test.describe('Automations page navigation', () => {
  test('should navigate to reorder page when Reorder button is clicked', async ({ automationsPage, page }) => {
    // Arrange

    // Act
    await automationsPage.reorderButton.click();

    // Assert
    await page.waitForURL(REORDER_URL_REGEX);
    expect(page.url()).toMatch(REORDER_URL_REGEX);
  });

  test('should navigate to new automation when New button is clicked', async ({ automationsPage, page }) => {
    // Arrange

    // Act
    await automationsPage.addButton.click();

    // Assert — navigated to a new automation UUID route
    await page.waitForURL(/\/automations\/[a-f0-9-]{36}/);
    expect(page.url()).toMatch(/\/automations\/[a-f0-9-]{36}/);
  });
});
