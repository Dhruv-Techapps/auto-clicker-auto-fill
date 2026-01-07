import { ActionRequest } from '@dhruv-techapps/core-extension';
import { CoreService } from './core-service';

export class ActionService extends CoreService {
  static override shouldTrace = false;
  static async setBadgeBackgroundColor(details: chrome.action.BadgeColorDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setBadgeBackgroundColor', message: details });
  }

  static async setBadgeText(details: chrome.action.BadgeTextDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setBadgeText', message: details });
  }

  static async setIcon(details: chrome.action.TabIconDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setIcon', message: details });
  }

  static async setTitle(details: chrome.action.TitleDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setTitle', message: details });
  }

  static async setBadgeTextColor(details: chrome.action.BadgeColorDetails) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'setBadgeTextColor', message: details });
  }

  static async enable(tabId?: number) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'enable', message: { tabId } });
  }

  static async disable(tabId?: number) {
    return await this.message<ActionRequest>({ messenger: 'action', methodName: 'disable', message: { tabId } });
  }
}
