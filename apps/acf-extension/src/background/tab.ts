import { PortService } from '@dhruv-techapps/core-service';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications/handler';
import { OPTIONS_PAGE_URL } from '../common/environments';

let optionsTab: chrome.tabs.Tab | undefined;

chrome.tabs.onRemoved.addListener((tabId) => {
  if (optionsTab?.id === tabId) {
    optionsTab = undefined;
  }
});

const TABS_I18N = {
  TITLE: chrome.i18n.getMessage('@TABS__TITLE'),
  ERROR: chrome.i18n.getMessage('@TABS__ERROR')
};

const NOTIFICATIONS_ID = 'Tabs Messenger';
export class TabsMessenger {
  static optionsTab(properties?: chrome.tabs.UpdateProperties) {
    if (optionsTab?.id) {
      chrome.tabs.update(optionsTab.id, { url: OPTIONS_PAGE_URL, ...properties, active: true });
    } else {
      chrome.tabs.create({ url: OPTIONS_PAGE_URL, ...properties, active: true }, (tab) => {
        optionsTab = tab;
      });
    }
  }

  async openOptionsPage(queryParams?: Record<string, string>) {
    if (OPTIONS_PAGE_URL) {
      const url = new URL(OPTIONS_PAGE_URL);
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          url.searchParams.append(key, value); // append allows duplicates
        });
      }
      TabsMessenger.optionsTab({ url: url.toString() });
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

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const isPanelOpen = (await chrome.runtime.getContexts({ contextTypes: ['SIDE_PANEL'] })).some((context) => context.contextType === 'SIDE_PANEL');
  if (isPanelOpen) {
    const currentTab = await chrome.tabs.get(activeInfo.tabId);
    PortService.getInstance('SidePanel').message({ messenger: 'SidePanelMessenger', methodName: 'onTabActivated', message: currentTab.url });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const isPanelOpen = (await chrome.runtime.getContexts({ contextTypes: ['SIDE_PANEL'] })).some((context) => context.contextType === 'SIDE_PANEL');
  if (isPanelOpen) {
    if (changeInfo.status === 'complete') {
      PortService.getInstance('SidePanel').message({ messenger: 'SidePanelMessenger', methodName: 'onTabUpdated', message: tab.url });
    }
  }
});
