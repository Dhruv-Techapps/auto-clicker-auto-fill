import { IAction } from '@dhruv-techapps/acf-common';
import { expect, pageTest as test } from './fixtures';

// Test site URL
const TEST_SITE_URL = 'https://test.getautoclicker.com';

// Basic form selectors (update as needed for your test site)
const FORM_INPUT_SELECTOR = '//input[@name="username"]';
const FORM_PASSWORD_SELECTOR = '//input[@type="password"]';


test.beforeAll(async ({ clearAutomations }) => {
  await clearAutomations();
});

test.describe('Basic Form Autofill by Extension',{
  tag: ['@basicForm', '@autofill', '@serial'], // Add tags for filtering if needed
}, () => {
  test.describe.configure({ mode: 'serial' });

  

  test('should create automation, save config, and autofill on site', async ({ sidebarPage,page,automationPage,getAutomations }) => {
    
    await sidebarPage.goto();

    // 1. Create new automation
    await sidebarPage.addNewAutomation();

    // 2. Set automation URL and name
    await automationPage.newAutomatonUrlInput.fill(TEST_SITE_URL);
    await automationPage.newAutomatonUrlInput.blur();
    await automationPage.newAutomatonUrlInput.press('Enter');

    await page.waitForURL('**/automations/*'); // Wait for navigation to automation edit page
    // 3. Add two actions
    await automationPage.fillStep(0, 'elementFinder', FORM_INPUT_SELECTOR);
    await automationPage.fillStep(0, 'value', 'Dharmesh');

    await automationPage.addStep();
    await automationPage.fillStep(1, 'elementFinder', FORM_PASSWORD_SELECTOR);
    await automationPage.fillStep(1, 'value', 'password123');

    // get id from url https://dev.getautoclicker.com/automations/fa9a91a2-1b14-49af-9565-644cf8ed2f58
    const url = new URL(page.url());
    const automationId = url.pathname.split('/').pop();
    expect(automationId).toBeTruthy();

    // 5. Check if new config is saved in extension storage
    const automations = await getAutomations();
    const created = automations.find((a: any) => a.id === automationId);
    expect(created).toBeTruthy();
    if(!created) return; // To satisfy TypeScript, won't actually run if assertion fails
    expect(created.actions.length).toBeGreaterThanOrEqual(2);
    expect((created.actions[0] as IAction).elementFinder).toBe(FORM_INPUT_SELECTOR);
    expect((created.actions[0] as IAction).value).toBe('Dharmesh');
    expect((created.actions[1] as IAction).elementFinder).toBe(FORM_PASSWORD_SELECTOR);
    expect((created.actions[1] as IAction).value).toBe('password123');

    // 6. Open test site and check autofill/auto-click
    const sitePage = await page.context().newPage();
    sitePage.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
    await sitePage.goto(TEST_SITE_URL);
    await sitePage.waitForLoadState('networkidle'); // Wait for page to load
    await sitePage.waitForTimeout(1000); // Wait a bit for automation to trigger
    // Wait for autofill
    await sitePage.waitForSelector(FORM_INPUT_SELECTOR);
    const inputValue = await sitePage.$eval(FORM_INPUT_SELECTOR, el => (el as HTMLInputElement).value);
    expect(inputValue).toBe('Dharmesh');

    const passwordValue = await sitePage.$eval(FORM_PASSWORD_SELECTOR, el => (el as HTMLInputElement).value);
    expect(passwordValue).toBe('password123');
    // Optionally, check if button was clicked (depends on site behavior)
    // You may want to check for a side effect, e.g., form submitted, etc.
    //await wasButtonClicked(sitePage, '//button[@alert]', 5000); // Adjust selector and timeout as needed
  });
});
