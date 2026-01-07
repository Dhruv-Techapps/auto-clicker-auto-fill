import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { trace } from '@opentelemetry/api';

export function registerNotifications(optionsPageUrl?: string) {
  trace.getTracer('service-worker', chrome.runtime.getManifest().version).startActiveSpan('register-notifications', (span) => {
    if (optionsPageUrl) {
      chrome.notifications.onClicked.addListener((notificationId) => {
        span.addEvent('notification-onClicked', { 'notification.id': notificationId });
        if (notificationId === 'error') {
          chrome.tabs.create({ url: optionsPageUrl });
        }
      });

      chrome.notifications.onClosed.addListener((notificationId, byUser) => {
        span.addEvent('notification-onClosed', { 'notification.id': notificationId, byUser });
        Logger.info('Notification onClosed', { byUser, notificationId });
      });
    }
    span.end();
  });
}
