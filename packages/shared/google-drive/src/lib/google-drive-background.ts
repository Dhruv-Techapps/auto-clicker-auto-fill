/*global chrome*/

import { FirebaseFunctionsBackground } from '@dhruv-techapps/shared-firebase-functions';
import { GOOGLE_SCOPES } from '@dhruv-techapps/shared-google-oauth';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications';
import { BACKUP_ALARM, MINUTES_IN_DAY, NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from './google-drive.constant';
import { EAutoBackup, IDriveFile, IGoogleDriveFile } from './google-drive.types';

export class GoogleDriveBackground extends FirebaseFunctionsBackground {
  scopes = [GOOGLE_SCOPES.DRIVE];

  async autoBackup(autoBackup: EAutoBackup) {
    const alarmInfo: chrome.alarms.AlarmCreateInfo = { when: Date.now() + 500 };
    await chrome.alarms.clear(BACKUP_ALARM);
    switch (autoBackup) {
      case EAutoBackup.DAILY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY;
        break;
      case EAutoBackup.WEEKLY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY * 7;
        break;
      case EAutoBackup.MONTHLY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY * 30;
        break;
      case EAutoBackup.OFF:
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Auto backup off', false);
        return;
      default:
        break;
    }
    NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, `Auto backup set ${autoBackup}`, false);
    chrome.alarms.create(BACKUP_ALARM, alarmInfo);
  }

  async _createOrUpdate(name: string, data: unknown, id?: string) {
    if (id) {
      const result = await this.driveUpdate<{ id: string; name: string; data: unknown }, IDriveFile>({ id, name, data });
      return result;
    }
    const result = await this.driveCreate({ name, data });
    return result;
  }

  async delete(request: { id: string; name: string }) {
    const response = await this.driveDelete<{ id: string; name: string }, { error: string }>(request);
    if (response.error) {
      throw new Error(response.error);
    }
  }

  async listWithContent(): Promise<Array<IDriveFile>> {
    const { files } = await this.driveList<IGoogleDriveFile>();
    if (!files) return [];
    for (const file of files) {
      file.content = await this.driveGet(file);
    }
    return files;
  }
}
