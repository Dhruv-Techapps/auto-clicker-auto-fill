import { Logger } from '@dhruv-techapps/core-common';

export function registerNotifications(optionsPageUrl?: string) {
  if (optionsPageUrl) {
    chrome.notifications.onClicked.addListener((notificationId) => {
      if (notificationId === 'error') {
        chrome.tabs.create({ url: optionsPageUrl });
      }
    });

    chrome.notifications.onClosed.addListener((notificationId, byUser) => {
      Logger.colorInfo('Notification onClosed', notificationId, byUser);
    });
  }
}

export class NotificationHandler {
  static async notify(id: string, title: string, message: string, requireInteraction = true) {
    const { action } = chrome.runtime.getManifest();
    const defaultOptions: chrome.notifications.NotificationCreateOptions = {
      type: 'basic',
      iconUrl: action.default_icon,
      title,
      message,
      requireInteraction,
      silent: false
    };
    chrome.notifications.create(id, { ...defaultOptions });
  }
}
