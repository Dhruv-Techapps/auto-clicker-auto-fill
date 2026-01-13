import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { googleAnalytics } from './google-analytics';
import { TabsMessenger } from './tab';

chrome.commands.onCommand.addListener((command, tab) => {
  Logger.info(`Command received: ${command} on tab ${tab?.id}`);
  googleAnalytics?.fireEvent({ name: 'Command', params: { location: command, source: 'background' } });
  if (command === 'options-page') {
    TabsMessenger.optionsTab();
  } else if (command === 'side-panel') {
    if (tab?.id) {
      chrome.sidePanel.open({ tabId: tab.id }).catch(console.warn);
    }
  }
});
