import { IConfiguration, ISettings } from '@dhruv-techapps/acf-common';
import { ConfigStorage, SettingsStorage } from '@dhruv-techapps/acf-store';
import { migrateConfigBoundedLegacy, migrateConfigInterval, migrateConfigThen } from '@dhruv-techapps/acf-util';

export class StorageMigration {
  static async migrate(): Promise<void> {
    // First handle legacy bounded values(-2) -> 'unlimited'
    await this.migrateConfigs();
    // Migrate persisted settings separately (retry)
    await this.migrateSettingsBoundedLegacy();
  }

  static async migrateConfigs() {
    const configs: IConfiguration[] = await ConfigStorage.getConfigs();

    configs.forEach((config) => {
      migrateConfigBoundedLegacy(config);
      migrateConfigThen(config);
      migrateConfigInterval(config);
    });

    await ConfigStorage.setConfigs(configs);
  }

  /**
   * Convert legacy sentinel -2 to 'unlimited' for persisted settings
   * Targets: settings.retry
   */
  static async migrateSettingsBoundedLegacy(): Promise<void> {
    try {
      const settings: ISettings = await SettingsStorage.getSettings();
      if (!settings) return;

      const s: ISettings = JSON.parse(JSON.stringify(settings));
      let changed = false;
      if (s.retry === -2) {
        s.retry = 'unlimited';
        changed = true;
      }

      if (changed) {
        await SettingsStorage.setSettings(s);
      }
    } catch (error) {
      // non-fatal
       
      console.warn('settings migration failed', error);
    }
  }
}
