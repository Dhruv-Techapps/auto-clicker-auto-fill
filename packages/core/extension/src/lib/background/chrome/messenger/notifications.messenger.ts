import type { NotificationsMessengerCreateProps, NotificationsMessengerProps, NotificationsMessengerUpdateProps } from '@dhruv-techapps/core-types';

export class NotificationsMessenger {
  create({ notificationId, options }: NotificationsMessengerCreateProps) {
    return new Promise((resolve) => {
      chrome.notifications.create(notificationId, options, (notificationId: string) => {
        resolve(notificationId);
      });
    });
  }

  update({ notificationId, options }: NotificationsMessengerUpdateProps) {
    return new Promise((resolve) => {
      return chrome.notifications.update(notificationId, options, (wasUpdated: boolean) => {
        resolve(wasUpdated);
      });
    });
  }

  clear({ notificationId }: NotificationsMessengerProps) {
    return new Promise((resolve) => {
      chrome.notifications.clear(notificationId, (wasCleared: boolean) => {
        resolve(wasCleared);
      });
    });
  }
}
