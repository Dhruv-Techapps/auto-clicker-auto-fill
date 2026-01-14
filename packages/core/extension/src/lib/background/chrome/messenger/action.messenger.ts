export class ActionMessenger {
  disable(_: void, sender: chrome.runtime.MessageSender) {
    return chrome.action.disable(sender.tab?.id);
  }

  enable(_: void, sender: chrome.runtime.MessageSender) {
    return chrome.action.enable(sender.tab?.id);
  }

  setIcon(details: chrome.action.TabIconDetails, sender: chrome.runtime.MessageSender) {
    return chrome.action.setIcon({ ...details, tabId: sender.tab?.id });
  }

  setBadgeBackgroundColor(details: chrome.action.BadgeColorDetails, sender: chrome.runtime.MessageSender) {
    return chrome.action.setBadgeBackgroundColor({ ...details, tabId: sender.tab?.id });
  }

  setBadgeText(details: chrome.action.BadgeTextDetails, sender: chrome.runtime.MessageSender) {
    return chrome.action.setBadgeText({ ...details, tabId: sender.tab?.id });
  }

  setBadgeTextColor(details: chrome.action.BadgeColorDetails, sender: chrome.runtime.MessageSender) {
    return chrome.action.setBadgeTextColor({ ...details, tabId: sender.tab?.id });
  }

  setTitle(details: chrome.action.TitleDetails, sender: chrome.runtime.MessageSender) {
    return chrome.action.setTitle({ ...details, tabId: sender.tab?.id });
  }
}
