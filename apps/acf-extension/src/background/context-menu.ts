import { LOCAL_STORAGE_KEY, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { ConfigStorage } from '@dhruv-techapps/acf-store';
import { Logger, Span, tracer } from '@dhruv-techapps/core-open-telemetry/background';
import { GoogleAnalyticsBackground } from '@dhruv-techapps/shared-google-analytics/background';

import { SIDE_PANEL } from '../common/constant';
const CONTEXT_MENU_ELEMENT_ID = 'element-mode';
const CONTEXT_MENU_SEPARATOR_ID = 'config-separator';
const CONTEXT_MENU_CONFIG_PAGE_ID = 'config-page-mode';

const CONTEXT_MENU_I18N = {
  FIELD: chrome.i18n.getMessage('@CONTEXT_MENU__FIELD'),
  RECORD: chrome.i18n.getMessage('@CONTEXT_MENU__RECORD'),
  SIDE_PANEL: chrome.i18n.getMessage('@CONTEXT_MENU__SIDE_PANEL'),
  CONFIG_PAGE: chrome.i18n.getMessage('@CONTEXT_MENU__CONFIG_PAGE')
};

const registerConfigsContextMenus = (span: Span) => {
  span.addEvent('register-configs-context-menus');
  let contextMenuExist = false;
  chrome.tabs.onActivated.addListener(() => {
    span.addEvent('tabs-onActivated');
    if (contextMenuExist) {
      contextMenuExist = false;
      chrome.contextMenus.remove('configs-list-separator');
      chrome.contextMenus.remove('configs-list');
    }
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.url) {
        const configs = await new ConfigStorage().getAllConfigs(currentTab.url);
        if (configs) {
          contextMenuExist = true;
          chrome.contextMenus.create({ id: 'configs-list-separator', type: 'separator', contexts: ['all'] });
          chrome.contextMenus.create({
            id: 'configs-list',
            title: `${configs.length} Configs Found`,
            contexts: ['all']
          });
          configs.forEach((config) => {
            chrome.contextMenus.create({
              id: `config|${config.id}|${currentTab.id}`,
              title: config.name,
              contexts: ['all'],
              parentId: 'configs-list'
            });
          });
        }
      }
    });
  });
};

export default function registerContextMenus(optionsPageUrl?: string, googleAnalytics?: GoogleAnalyticsBackground) {
  tracer.startActiveSpan('register-context-menus', (span) => {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({ id: CONTEXT_MENU_ELEMENT_ID, title: CONTEXT_MENU_I18N.FIELD, contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio', 'video'] });
    chrome.contextMenus.create({ id: SIDE_PANEL, title: CONTEXT_MENU_I18N.SIDE_PANEL, contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio', 'video'] });
    chrome.contextMenus.create({ id: CONTEXT_MENU_SEPARATOR_ID, type: 'separator', contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio', 'video'] });
    chrome.contextMenus.create({ id: CONTEXT_MENU_CONFIG_PAGE_ID, title: CONTEXT_MENU_I18N.CONFIG_PAGE, contexts: ['all'] });

    registerConfigsContextMenus(span);

    chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, tab) => {
      span.addEvent('context-menus-onClicked', { 'menu.item.id': menuItemId });
      Logger.info('chrome.contextMenus.onClicked', `Context menu item clicked: ${menuItemId}`);
      switch (menuItemId) {
        case CONTEXT_MENU_CONFIG_PAGE_ID:
          chrome.tabs.create({ url: optionsPageUrl });
          googleAnalytics?.fireEvent({ name: 'Web', params: { location: 'contextMenus.onClicked', source: 'background' } });
          break;
        case SIDE_PANEL:
          if (tab?.id) {
            chrome.sidePanel.open({ tabId: tab.id }).catch((error) => {
              span.addEvent('chrome.contextMenus.onClicked', { 'error.message': error.message });
              Logger.error('chrome.contextMenus.onClicked', {
                error
              });
            });
            googleAnalytics?.fireEvent({ name: 'SidePanel', params: { location: 'contextMenus.onClicked', source: 'background' } });
          }
          break;
        case CONTEXT_MENU_ELEMENT_ID:
          {
            if (!optionsPageUrl) {
              throw new Error('optionsPageUrl is not defined');
            }
            const url = new URL(optionsPageUrl);
            const { url: configURL, xpath } = await chrome.storage.local.get<{ url: string; xpath: string }>([LOCAL_STORAGE_KEY.URL, LOCAL_STORAGE_KEY.XPATH]);
            url.searchParams.append('url', configURL);
            url.searchParams.append('elementFinder', xpath);
            chrome.tabs.create({ url: url.href });
            googleAnalytics?.fireEvent({ name: 'Web', params: { location: 'contextMenus.onClicked', data: true, source: 'background' } });
            chrome.storage.local.remove(['url', 'xpath']);
          }
          break;
        default:
          if (typeof menuItemId === 'string' && menuItemId.includes('config|')) {
            const [, configId, tabId] = menuItemId.split('|');
            chrome.tabs.sendMessage(Number(tabId), { configId, action: RUNTIME_MESSAGE_ACF.RUN_CONFIG });
          }
          break;
      }
    });
    span.end();
  });
}
