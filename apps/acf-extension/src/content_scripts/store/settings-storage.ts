import { LOCAL_STORAGE_KEY, Settings, defaultSettings } from '@dhruv-techapps/acf-common';

export default class SettingsStorage {
  async getSettings(): Promise<Settings> {
    const { settings = defaultSettings } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS);
    return settings;
  }
}
