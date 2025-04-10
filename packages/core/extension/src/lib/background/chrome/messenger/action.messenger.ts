export type ActionRequest = {
  messenger: 'action';
  methodName: 'setIcon' | 'setBadgeBackgroundColor' | 'setBadgeText' | 'setTitle';
  message: chrome.action.TabIconDetails | chrome.action.BadgeColorDetails | chrome.action.BadgeTextDetails | chrome.action.TitleDetails;
};

export class ActionMessenger {
  setIcon(details: chrome.action.TabIconDetails) {
    return chrome.action.setIcon(details);
  }

  setBadgeBackgroundColor(details: chrome.action.BadgeColorDetails) {
    return chrome.action.setBadgeBackgroundColor(details);
  }

  setBadgeText(details: chrome.action.BadgeTextDetails) {
    return chrome.action.setBadgeText(details);
  }

  setTitle(details: chrome.action.TitleDetails) {
    return chrome.action.setTitle(details);
  }
}
