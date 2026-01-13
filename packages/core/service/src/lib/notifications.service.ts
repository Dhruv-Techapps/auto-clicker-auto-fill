import { generateUUID } from '@dhruv-techapps/core-common';
import type { NotificationsRequest } from '@dhruv-techapps/core-types';
import { CoreService } from './core-service';

export class NotificationsService extends CoreService {
  static async create(options: chrome.notifications.NotificationCreateOptions, notificationId: string = generateUUID()) {
    return await this.message<NotificationsRequest>({ messenger: 'notifications', message: { notificationId, options }, methodName: 'create' });
  }

  static async update(options: chrome.notifications.NotificationOptions, notificationId: string = generateUUID()) {
    return await this.message<NotificationsRequest>({ messenger: 'notifications', message: { notificationId, options }, methodName: 'update' });
  }

  static async clear(notificationId: string = generateUUID()) {
    return await this.message<NotificationsRequest>({ messenger: 'notifications', message: { notificationId }, methodName: 'clear' });
  }
}
