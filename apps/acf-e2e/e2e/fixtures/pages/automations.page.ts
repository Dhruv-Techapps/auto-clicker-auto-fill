import { type Locator, type Page } from '@playwright/test';
import { URLS } from '../base-url';

export class AutomationsPage {
  readonly container: Locator;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly addButton: Locator;
  readonly importButton: Locator;
  readonly selectButton: Locator;
  readonly reorderButton: Locator;
  readonly automationsCount: Locator;
  readonly listItems: Locator;

  // Selection mode controls
  readonly selectAllCheckbox: Locator;
  readonly exportButton: Locator;
  readonly deleteButton: Locator;
  readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.container = page.getByTestId('automations-page');
    this.heading = this.container.getByRole('heading', { name: 'My Automations' });
    this.searchInput = this.container.getByPlaceholder('Search your automations...');
    this.addButton = this.container.getByTestId('automations-add-automation');
    this.importButton = this.container.getByRole('button', { name: /import/i });
    this.selectButton = this.container.getByTitle('Select automations to export or delete');
    this.reorderButton = this.container.getByTitle('Reorder');
    this.automationsCount = this.container.getByText(/automations within extension/);
    this.listItems = this.container.locator('.list-group-flush .list-group-item');
    this.selectAllCheckbox = this.container.locator('#config-all');
    this.exportButton = this.container.getByTitle('Export selected');
    this.deleteButton = this.container.getByTitle('Delete selected');
    this.cancelButton = this.container.getByTitle('Cancel selection');
  }

  async goto() {
    await this.page.goto(URLS.AUTOMATIONS);
  }

  itemCheckboxes() {
    return this.container.locator('.list-group-item input[type="checkbox"]');
  }

  async enterSelectionMode() {
    await this.selectButton.click();
  }

  async exitSelectionMode() {
    await this.cancelButton.click();
  }
}
