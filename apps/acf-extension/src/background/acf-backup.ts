/*global chrome*/

import { LOCAL_STORAGE_KEY, defaultSettings, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { BACKUP_ALARM, DriveFile, GoogleDriveBackground, GoogleDriveFile } from '@dhruv-techapps/shared-google-drive';
import { GOOGLE_SCOPES } from '@dhruv-techapps/shared-google-oauth';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications';
import { EDGE_OAUTH_CLIENT_ID, FIREBASE_FUNCTIONS_URL } from '../common/environments';
import { auth } from './firebase';

const ID = 'acf-backup';

const ACF_BACKUP_I18N = {
  NOTIFICATION_TITLE: chrome.i18n.getMessage('@ACF_BACKUP__NOTIFICATION_TITLE'),
  NOTIFICATION_RESTORE: chrome.i18n.getMessage('@ACF_BACKUP__NOTIFICATION_RESTORE'),
  ERROR_NO_CONFIG: chrome.i18n.getMessage('@ACF_BACKUP__ERROR_NO_CONFIG'),
  ERROR_NO_CONTENT: chrome.i18n.getMessage('@ACF_BACKUP__ERROR_NO_CONTENT')
};

const ACF_BACKUP_I18N_KEY = {
  NOTIFICATION_BACKUP: '@ACF_BACKUP__NOTIFICATION_BACKUP'
};

const BACKUP_FILE_NAMES = {
  CONFIGS: `${LOCAL_STORAGE_KEY.CONFIGS}.txt`,
  SETTINGS: `${LOCAL_STORAGE_KEY.SETTINGS}.txt`
};

export default class AcfBackup extends GoogleDriveBackground {
  override scopes = [GOOGLE_SCOPES.DRIVE, GOOGLE_SCOPES.PROFILE];

  async backup(now?: boolean): Promise<string> {
    const { configs = [getDefaultConfig()] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
    const { settings = { ...defaultSettings } } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS);
    const { files } = await this.driveList<GoogleDriveFile>();
    await this._createOrUpdate(BACKUP_FILE_NAMES.CONFIGS, configs, files.find((file) => file.name === BACKUP_FILE_NAMES.CONFIGS)?.id);
    await this._createOrUpdate(BACKUP_FILE_NAMES.SETTINGS, settings, files.find((file) => file.name === BACKUP_FILE_NAMES.SETTINGS)?.id);
    if (!settings.backup) {
      settings.backup = {};
    }
    const lastBackup = new Date().toLocaleString();
    settings.backup.lastBackup = lastBackup;
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: settings });
    if (now) {
      NotificationHandler.notify(ID, ACF_BACKUP_I18N.NOTIFICATION_TITLE, chrome.i18n.getMessage(ACF_BACKUP_I18N_KEY.NOTIFICATION_BACKUP, settings.backup.lastBackup));
    }
    return lastBackup;
  }

  async restore(file: DriveFile): Promise<void> {
    const fileContent = await this.driveGet(file);
    if (fileContent) {
      if (file.name === BACKUP_FILE_NAMES.SETTINGS) {
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: fileContent });
      }
      if (file.name === BACKUP_FILE_NAMES.CONFIGS) {
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: fileContent });
      }
      NotificationHandler.notify(ID, ACF_BACKUP_I18N.NOTIFICATION_TITLE, ACF_BACKUP_I18N.NOTIFICATION_RESTORE);
      return;
    }
    throw new Error(ACF_BACKUP_I18N.ERROR_NO_CONTENT);
  }
}

auth.authStateReady().then(() => {
  /**
   * Alarm which periodically backup configurations
   */
  chrome.alarms.onAlarm.addListener(({ name }) => {
    if (name === BACKUP_ALARM) {
      new AcfBackup(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID).backup();
    }
  });
});
