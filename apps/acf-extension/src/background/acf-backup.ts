/*global chrome*/

import { LOCAL_STORAGE_KEY, getDefaultConfig, defaultSettings } from '@dhruv-techapps/acf-common';
import { BACKUP_ALARM, DriveFile, GoogleDriveBackground, NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from '@dhruv-techapps/google-drive';
import { GOOGLE_SCOPES } from '@dhruv-techapps/google-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';

const BACKUP_FILE_NAMES = {
  CONFIGS: `${LOCAL_STORAGE_KEY.CONFIGS}.txt`,
  SETTINGS: `${LOCAL_STORAGE_KEY.SETTINGS}.txt`,
};

export default class AcfBackup extends GoogleDriveBackground {
  scopes = [GOOGLE_SCOPES.DRIVE, GOOGLE_SCOPES.PROFILE];

  async backup(now?: boolean) {
    try {
      const { configs = [getDefaultConfig()] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
      if (configs) {
        const { settings = { ...defaultSettings } } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS);
        const { files } = await this.list();
        await this.createOrUpdate(BACKUP_FILE_NAMES.CONFIGS, configs, files.find((file) => file.name === BACKUP_FILE_NAMES.CONFIGS)?.id);
        await this.createOrUpdate(BACKUP_FILE_NAMES.SETTINGS, settings, files.find((file) => file.name === BACKUP_FILE_NAMES.SETTINGS)?.id);
        if (!settings.backup) {
          settings.backup = {};
        }
        const lastBackup = new Date().toLocaleString();
        settings.backup.lastBackup = lastBackup;
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: settings });
        if (now) {
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, `Configurations are backup on Google Drive at ${settings.backup.lastBackup}`);
        }
        return lastBackup;
      }
    } catch (error) {
      if (error instanceof Error) {
        const retry = await this.checkInvalidCredentials(error.message);
        if (retry) {
          this.backup(now);
        }
      }
    }
  }

  async restore(file: DriveFile) {
    try {
      const fileContent = await this.get(file);
      if (fileContent) {
        if (file.name === BACKUP_FILE_NAMES.SETTINGS) {
          chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: fileContent });
        }
        if (file.name === BACKUP_FILE_NAMES.CONFIGS) {
          chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: fileContent });
        }
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Configurations are restored from Google Drive. Refresh configurations page to load content.');
      }
    } catch (error) {
      if (error instanceof Error) {
        const retry = await this.checkInvalidCredentials(error.message);
        if (retry) {
          this.restore(file);
        }
      }
    }
  }
}

/**
 * Alarm which periodically backup configurations
 */
chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === BACKUP_ALARM) {
    new AcfBackup().backup();
  }
});
