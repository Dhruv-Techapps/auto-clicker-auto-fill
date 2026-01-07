import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { DeviceStorage } from '@dhruv-techapps/core-store';
import { AcfSchedule } from '../acf-schedule';
import { googleAnalytics } from '../google-analytics';
import { TabsMessenger } from '../tab';

/**
 *  On initial install setup basic configuration
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  Logger.info('chrome.runtime.onInstalled', `Extension ${details.reason}`);
  googleAnalytics?.fireEvent({ name: 'Web', params: { location: 'runtime:onInstalled', source: 'background', events: [{ name: details.reason, params: { ...details } }] } });
  if (details.reason === 'install') {
    const storageResult = await chrome.storage.local.get([LOCAL_STORAGE_KEY.CONFIGS]);
    if (!storageResult[LOCAL_STORAGE_KEY.CONFIGS]) {
      TabsMessenger.optionsTab();
    }
  } else {
    new AcfSchedule().check();
  }

  DeviceStorage.getDeviceInfo();
});
