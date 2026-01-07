import { ISettings, LOCAL_STORAGE_KEY, defaultSettings } from '@dhruv-techapps/acf-common';

export class SettingsStorage {
  static async getSettings(): Promise<ISettings> {
    try {
      const { settings = defaultSettings } = await chrome.storage.local.get<{ settings: ISettings }>(LOCAL_STORAGE_KEY.SETTINGS);
      return settings;
    } catch (error) {
      console.error('Error in fetching settings from storage', error);
      throw error;
    }
    return defaultSettings;
  }
}
