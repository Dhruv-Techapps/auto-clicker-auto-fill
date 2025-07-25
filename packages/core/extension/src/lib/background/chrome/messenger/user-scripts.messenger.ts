export interface UserScriptsRequest {
  messenger: 'userScripts';
  methodName: 'execute';
  message: string;
}

export type UserScriptsResponse = Promise<chrome.userScripts.InjectionResult[]>;

export class UserScriptsMessenger {
  execute(code: string, sender: chrome.runtime.MessageSender): UserScriptsResponse {
    const tabId = sender.tab?.id;
    if (typeof tabId !== 'number') {
      throw new Error('Tab ID is not defined or invalid');
    }
    return chrome.userScripts.execute({
      injectImmediately: true,
      target: { tabId },
      js: [{ code }]
    });
  }
}
