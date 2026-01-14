export interface NotificationsMessengerProps {
  notificationId: string;
}

export type NotificationsMessengerCreateProps = NotificationsMessengerProps & {
  options: chrome.notifications.NotificationCreateOptions;
};
export type NotificationsMessengerUpdateProps = NotificationsMessengerProps & {
  options: chrome.notifications.NotificationOptions;
};

export interface NotificationsRequest {
  messenger: 'notifications';
  methodName: 'create' | 'update' | 'clear';
  message: NotificationsMessengerProps | NotificationsMessengerCreateProps | NotificationsMessengerUpdateProps;
}
