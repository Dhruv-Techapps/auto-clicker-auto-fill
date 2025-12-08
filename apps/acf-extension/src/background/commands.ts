import { googleAnalytics } from './google-analytics';
import { TabsMessenger } from './tab';

chrome.commands.onCommand.addListener((command, tab) => {
  googleAnalytics?.fireEvent({ name: 'Command', params: { location: command } });
  if (command === 'options-page') {
    TabsMessenger.optionsTab();
  } else if (command === 'side-panel') {
    if (tab?.id) {
      chrome.sidePanel.open({ tabId: tab.id }).catch(console.warn);
    }
  }
});
