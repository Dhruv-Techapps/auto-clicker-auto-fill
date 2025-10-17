import { ActionRequest } from '@dhruv-techapps/core-extension';
import { PortService } from './service';

export class ActionService {
  static setBadgeBackgroundColor(details: chrome.action.BadgeColorDetails) {
    PortService.getInstance().message<ActionRequest>({ messenger: 'action', methodName: 'setBadgeBackgroundColor', message: details });
  }

  static setBadgeText(details: chrome.action.BadgeTextDetails) {
    PortService.getInstance().message<ActionRequest>({ messenger: 'action', methodName: 'setBadgeText', message: details });
  }

  static setIcon(details: chrome.action.TabIconDetails) {
    PortService.getInstance().message<ActionRequest>({ messenger: 'action', methodName: 'setIcon', message: details });
  }

  static setTitle(details: chrome.action.TitleDetails) {
    PortService.getInstance().message<ActionRequest>({ messenger: 'action', methodName: 'setTitle', message: details });
  }

  static setBadgeTextColor(details: chrome.action.BadgeColorDetails) {
    PortService.getInstance().message<ActionRequest>({ messenger: 'action', methodName: 'setBadgeTextColor', message: details });
  }

  static enable(tabId?: number) {
    PortService.getInstance().message<ActionRequest>({ messenger: 'action', methodName: 'enable', message: { tabId } });
  }

  static disable(tabId?: number) {
    PortService.getInstance().message<ActionRequest>({ messenger: 'action', methodName: 'disable', message: { tabId } });
  }
}
