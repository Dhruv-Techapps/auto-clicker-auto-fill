import { IConfiguration, ISettings } from '@dhruv-techapps/acf-common';
import { ConfigStorage, SettingsStorage } from '@dhruv-techapps/acf-store';
import { migrateConfig, migrateSettings } from '@dhruv-techapps/acf-util';
import { handleError, Span, tracer } from '@dhruv-techapps/core-open-telemetry';

export class StorageMigration {
  static async migrate(): Promise<void> {
    return await tracer.startActiveSpan('StorageMigration.migrate', async (span) => {
      try {
        await this.migrateConfigs(span);
        await this.migrateSettings(span);
      } finally {
        span.end();
      }
    });
  }

  static async migrateConfigs(span: Span) {
    try {
      const configs: IConfiguration[] = await ConfigStorage.getConfigs();
      configs.forEach((config) => {
        migrateConfig(config);
      });
      await ConfigStorage.setConfigs(configs);
    } catch (error) {
      handleError(span, error, 'Error in migrating configs');
    }
  }

  static async migrateSettings(span: Span) {
    try {
      const settings: ISettings = await SettingsStorage.getSettings();
      if (!settings) return;
      migrateSettings(settings);
      await SettingsStorage.setSettings(settings);
    } catch (error) {
      handleError(span, error, 'Error in migrating settings');
    }
  }
}
