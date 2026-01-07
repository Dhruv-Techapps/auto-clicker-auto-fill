import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { googleAnalytics } from './google-analytics';
import { TabsMessenger } from './tab';

chrome.commands.onCommand.addListener((command, tab) => {
  Logger.info('chrome.commands.onCommand', `Command received: ${command}`);
  googleAnalytics?.fireEvent({ name: 'Command', params: { location: command, source: 'background' } });
  if (command === 'options-page') {
    TabsMessenger.optionsTab();
  } else if (command === 'side-panel') {
    if (tab?.id) {
      chrome.sidePanel.open({ tabId: tab.id }).catch((error) => {
        Logger.error('chrome.commands.onCommand', { error });
      });
    }
  }
});
