/*global chrome*/

import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { ConfigStorage, SettingsStorage } from '@dhruv-techapps/acf-store';
import { handleError, Logger, tracer } from '@dhruv-techapps/core-open-telemetry/background';
import { BACKUP_ALARM, GoogleDriveBackground, IDriveFile, IGoogleDriveFile } from '@dhruv-techapps/shared-google-drive/background';
import { GOOGLE_SCOPES } from '@dhruv-techapps/shared-google-oauth/background';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications/handler';
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
    return tracer.startActiveSpan('acf-backup-backup', async (span) => {
      try {
        const configs = await ConfigStorage.getConfigs();
        const settings = await SettingsStorage.getSettings();
        const { files } = await this.driveList<IGoogleDriveFile>();
        await this._createOrUpdate(BACKUP_FILE_NAMES.CONFIGS, configs, files.find((f) => f.name === BACKUP_FILE_NAMES.CONFIGS)?.id);
        await this._createOrUpdate(BACKUP_FILE_NAMES.SETTINGS, settings, files.find((f) => f.name === BACKUP_FILE_NAMES.SETTINGS)?.id);

        if (!settings.backup) settings.backup = { autoBackup: 'off', lastBackup: '' };
        const lastBackup = new Date().toLocaleString();
        settings.backup.lastBackup = lastBackup;
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: settings });
        if (now) NotificationHandler.notify(ID, ACF_BACKUP_I18N.NOTIFICATION_TITLE, chrome.i18n.getMessage(ACF_BACKUP_I18N_KEY.NOTIFICATION_BACKUP, lastBackup));
        return lastBackup;
      } catch (e) {
        handleError(span, e, 'AcfBackup.backup');
        throw e;
      } finally {
        span.end();
      }
    });
  }

  async restore(file: IDriveFile): Promise<void> {
    return tracer.startActiveSpan('acf-backup-restore', async (span) => {
      try {
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
      } catch (e) {
        handleError(span, e, 'AcfBackup.restore');
        throw e;
      } finally {
        span.end();
      }
    });
  }
}

auth.authStateReady().then(() => {
  chrome.alarms.onAlarm.addListener(({ name }) => {
    Logger.info('AcfBackup:alarmTriggered', { message: `Alarm triggered: ${name}` });
    if (name === BACKUP_ALARM) {
      new AcfBackup(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID).backup();
    }
  });
});
