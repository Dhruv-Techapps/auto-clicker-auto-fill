/* eslint-disable react-hooks/rules-of-hooks */
import { coreTest } from '../core';
import { AutomationsPage } from './automations.page';
import { HomePage } from './home.page';
import { SettingsAdditionalPage } from './settings.additional.page';
import { SettingsNotificationsPage } from './settings.notifications.page';
import { SettingsPage } from './settings.page';
import { SettingsRetryPage } from './settings.retry.page';
import { ToastPage } from './toast.page';

interface PagesFixtures {
  homePage: HomePage;
  toastPage: ToastPage;
  automationsPage: AutomationsPage;
  settingsPage: SettingsPage;
  settingsAdditionalPage: SettingsAdditionalPage;
  settingsNotificationsPage: SettingsNotificationsPage;
  settingsRetryPage: SettingsRetryPage;
}

export const pageTest = coreTest.extend<PagesFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  toastPage: async ({ page }, use) => {
    await use(new ToastPage(page));
  },
  settingsPage: async ({ page }, use) => {
    const settingsPage = new SettingsPage(page);
    await settingsPage.goto();
    await use(settingsPage);
  },
  settingsAdditionalPage: async ({ page }, use) => {
    const additionalPage = new SettingsAdditionalPage(page);
    await additionalPage.goto();
    await use(additionalPage);
  },
  settingsNotificationsPage: async ({ page }, use) => {
    const notificationsPage = new SettingsNotificationsPage(page);
    await notificationsPage.goto();
    await use(notificationsPage);
  },
  settingsRetryPage: async ({ page }, use) => {
    const retryPage = new SettingsRetryPage(page);
    await retryPage.goto();
    await use(retryPage);
  },
  automationsPage: async ({ page }, use) => {
    const automationsPage = new AutomationsPage(page);
    await automationsPage.goto();
    await use(automationsPage);
  }
});

export { AppearancePage } from './appearance.page';
export { AutomationsPage } from './automations.page';
export { HomePage } from './home.page';
export { SettingsAdditionalPage } from './settings.additional.page';
export { SettingsNotificationsPage } from './settings.notifications.page';
export { SettingsPage } from './settings.page';
export { SettingsRetryPage } from './settings.retry.page';
export { ToastPage } from './toast.page';
