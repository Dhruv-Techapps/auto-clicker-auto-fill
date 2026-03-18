/* eslint-disable react-hooks/rules-of-hooks */
import { coreTest } from '../core';
import { AppearancePage } from './appearance.page';
import { AutomationPage } from './automation.page';
import { AutomationsPage } from './automations.page';
import { HomePage } from './home.page';
import { SettingsAdditionalPage } from './settings.additional.page';
import { SettingsNotificationsPage } from './settings.notifications.page';
import { SettingsPage } from './settings.page';
import { SettingsRetryPage } from './settings.retry.page';
import { SidebarPage } from './side-bar.page';
import { ToastPage } from './toast.page';

interface PagesFixtures {
  homePage: HomePage;
  appearancePage: AppearancePage;
  toastPage: ToastPage;
  automationsPage: AutomationsPage;
  settingsPage: SettingsPage;
  settingsAdditionalPage: SettingsAdditionalPage;
  settingsNotificationsPage: SettingsNotificationsPage;
  settingsRetryPage: SettingsRetryPage;
  sidebarPage: SidebarPage;
  automationPage: AutomationPage;
}

export const pageTest = coreTest.extend<PagesFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  appearancePage: async ({ page }, use) => {
    await use(new AppearancePage(page));
  },
  toastPage: async ({ page }, use) => {
    await use(new ToastPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  settingsAdditionalPage: async ({ page }, use) => {
    await use(new SettingsAdditionalPage(page));
  },
  settingsNotificationsPage: async ({ page }, use) => {
    await use(new SettingsNotificationsPage(page));
  },
  settingsRetryPage: async ({ page }, use) => {
    await use(new SettingsRetryPage(page));
  },
  automationPage: async ({ page }, use) => {
    await use(new AutomationPage(page));
  },
  automationsPage: async ({ page }, use) => {
    await use(new AutomationsPage(page));
  },
  sidebarPage: async ({ page }, use) => {
    await use(new SidebarPage(page));
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
