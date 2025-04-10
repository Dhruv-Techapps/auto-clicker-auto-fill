import { NotificationHandler } from '@dhruv-techapps/shared-notifications';

let optionsTab: chrome.tabs.Tab | undefined;

chrome.tabs.onRemoved.addListener((tabId) => {
  if (optionsTab?.id === tabId) {
    optionsTab = undefined;
  }
});

const TABS_I18N = {
  TITLE: chrome.i18n.getMessage('@TABS__TITLE'),
  ERROR: chrome.i18n.getMessage('@TABS__ERROR'),
};

const NOTIFICATIONS_ID = 'Tabs Messenger';
export class TabsMessenger {
  static optionsTab(properties: chrome.tabs.UpdateProperties) {
    if (optionsTab?.id) {
      chrome.tabs.update(optionsTab.id, { ...properties, active: true });
    } else {
      chrome.tabs.create(properties, (tab) => {
        optionsTab = tab;
      });
    }
  }

  async update(updateProperties: chrome.tabs.UpdateProperties, sender: chrome.runtime.MessageSender) {
    if (sender.tab?.id) {
      chrome.tabs.update(sender.tab.id, updateProperties);
    } else {
      NotificationHandler.notify(NOTIFICATIONS_ID, TABS_I18N.TITLE, TABS_I18N.ERROR);
    }
  }

  async reload(_: string, sender: chrome.runtime.MessageSender) {
    if (sender.tab?.id) {
      chrome.tabs.reload(sender.tab.id);
    } else {
      NotificationHandler.notify(NOTIFICATIONS_ID, TABS_I18N.TITLE, TABS_I18N.ERROR);
    }
  }
}
