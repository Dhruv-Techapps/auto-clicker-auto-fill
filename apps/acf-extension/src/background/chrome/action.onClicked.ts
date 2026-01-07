import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { googleAnalytics } from '../google-analytics';
import { TabsMessenger } from '../tab';

/**
 * Browser Action set to open option page / configuration page
 */
chrome.action.onClicked.addListener(() => {
  Logger.info('chrome.action.onClicked', 'User clicked on extension icon');
  googleAnalytics?.fireEvent({ name: 'Web', params: { location: 'action:onClicked', source: 'background' } });
  TabsMessenger.optionsTab();
});
