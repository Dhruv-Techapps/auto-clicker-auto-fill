import { type Locator, Page } from '@playwright/test';

export class AutomationPage {
  readonly newAutomationContainer: Locator;
  readonly newAutomatonUrlInput: Locator;
  readonly container: Locator;
  readonly nameInput: Locator;
  readonly urlInput: Locator;
  readonly initWaitInput: Locator;
  readonly actionList: Locator;
  readonly addActionButton: Locator;
  readonly saveButton: Locator;
  constructor(private readonly page: Page) {
    this.container = page.getByTestId('automation-edit-form');
    this.newAutomationContainer = page.getByTestId('automation-url-form');
    this.newAutomatonUrlInput = this.newAutomationContainer.getByTestId('automation-url-input');
    this.nameInput = this.container.getByTestId('automation-name-input');
    this.urlInput = this.container.getByTestId('automation-url-input');
    this.initWaitInput = this.container.getByTestId('automation-init-wait-input');
    this.actionList = this.container.getByTestId('automation-action-list');
    this.addActionButton = this.container.getByTestId('add-action-btn');
    this.saveButton = this.container.getByTestId('save-automation-btn');
  }

  async selectAutomationByName(name: string) {
    await this.page.getByRole('link', { name, exact: true }).click();
  }

  async updateAutomationName(oldName: string, newName: string) {
    await this.selectAutomationByName(oldName);
    const nameInput = this.page.getByTestId('automation-name-input');
    await nameInput.fill(newName);
    await nameInput.blur();
  }

  async fillStep(stepIndex: number, name: string, value: string) {
    const step = this.page.locator(`#steps tbody tr:nth-child(${stepIndex + 1}) input[name=${name}]`);
    await step.fill(value);
    await step.blur();
  }

  async addStep() {
    await this.page.getByTestId('add-step-btn').click();
  }
}
