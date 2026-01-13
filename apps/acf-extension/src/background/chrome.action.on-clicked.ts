import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { googleAnalytics } from './google-analytics';
import { TabsMessenger } from './tab';

chrome.action.onClicked.addListener(() => {
  Logger.info('Browser action clicked');
  googleAnalytics?.fireEvent({ name: 'Web', params: { location: 'action:onClicked', source: 'background' } });
  TabsMessenger.optionsTab();
});
