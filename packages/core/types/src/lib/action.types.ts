export interface IActionRequest {
  messenger: 'action';
  methodName: 'setIcon' | 'setBadgeBackgroundColor' | 'setBadgeText' | 'setTitle' | 'setBadgeTextColor' | 'enable' | 'disable';
  message: chrome.action.TabIconDetails | chrome.action.BadgeColorDetails | chrome.action.BadgeTextDetails | chrome.action.TitleDetails;
}
