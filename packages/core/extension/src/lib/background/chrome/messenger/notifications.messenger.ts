interface NotificationsMessengerProps {
  notificationId: string;
}

type NotificationsMessengerCreateProps = NotificationsMessengerProps & {
  options: chrome.notifications.NotificationCreateOptions;
};
type NotificationsMessengerUpdateProps = NotificationsMessengerProps & {
  options: chrome.notifications.NotificationOptions;
};

export interface NotificationsRequest {
  messenger: 'notifications';
  methodName: 'create' | 'update' | 'clear';
  message: NotificationsMessengerProps | NotificationsMessengerCreateProps | NotificationsMessengerUpdateProps;
}

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
