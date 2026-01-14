export function registerNotifications(optionsPageUrl?: string) {
  if (optionsPageUrl) {
    chrome.notifications.onClicked.addListener((notificationId) => {
      if (notificationId === 'error') {
        chrome.tabs.create({ url: optionsPageUrl });
      }
    });

    chrome.notifications.onClosed.addListener((notificationId, byUser) => {
      console.log('Notification closed', { notificationId, byUser });
    });
  }
}

export class NotificationHandler {
  static async notify(id: string, title: string, message: string, requireInteraction = true) {
    const { action } = chrome.runtime.getManifest() as chrome.runtime.ManifestV3;
    const defaultOptions: chrome.notifications.NotificationCreateOptions = {
      type: 'basic',
      iconUrl: action?.default_icon?.['32'] || 'assets/icons/icon32.png',
      title,
      message,
      requireInteraction,
      silent: false
    };
    chrome.notifications.create(id, { ...defaultOptions });
  }
}
