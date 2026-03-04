import { ISettings, LOCAL_STORAGE_KEY, defaultSettings } from '@dhruv-techapps/acf-common';

export class SettingsStorage {
  static async getSettings(): Promise<ISettings> {
    try {
      const { settings = defaultSettings } = await chrome.storage.local.get<{ settings: ISettings }>(LOCAL_STORAGE_KEY.SETTINGS);
      return settings;
    } catch (error) {
      console.warn(error);
    }
    return defaultSettings;
  }

  static async setSettings(settings: ISettings): Promise<void> {
    try {
      await chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: settings });
    } catch (error) {
      console.warn(error);
    }
  }
}
