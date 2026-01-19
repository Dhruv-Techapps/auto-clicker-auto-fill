import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';

import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { DeviceStorage } from '@dhruv-techapps/core-store';
import { AcfSchedule } from './acf-schedule';
import { StorageMigration } from './storage-migration';
import { TabsMessenger } from './tab';

chrome.runtime.onInstalled.addListener(async (details) => {
  Logger.info(`Extension installed/updated: ${details.reason}`);
  if (details.reason === 'install') {
    const storageResult = await chrome.storage.local.get([LOCAL_STORAGE_KEY.CONFIGS]);
    if (!storageResult[LOCAL_STORAGE_KEY.CONFIGS]) {
      TabsMessenger.optionsTab();
    }
  } else {
    new AcfSchedule().check();
    await StorageMigration.migrate();
  }

  DeviceStorage.getDeviceInfo();
});
