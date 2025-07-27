import { IExtension } from '@dhruv-techapps/core-common';
import { NotificationsMessenger } from './notifications.messenger';

export interface IUserScriptsRequest {
  messenger: 'userScripts';
  methodName: 'execute';
  message: IUserScriptsExecuteProps;
}

export interface IUserScriptsExecuteProps {
  code: string;
  ext: IExtension;
}

export interface IUserScriptsExecuteResponse {
  result: unknown;
  error?: string;
}

async function isUserScriptsAvailable() {
  try {
    // Method call which throws if API permission or toggle is not enabled.
    await chrome.userScripts.getScripts();
    return true;
  } catch {
    // Not available.
    return false;
  }
}

function Notify() {
  const { action } = chrome.runtime.getManifest();
  const defaultOptions: chrome.notifications.NotificationCreateOptions = {
    type: 'basic',
    iconUrl: action.default_icon,
    title: 'Allow user scripts',
    message: 'User scripts API is not available. Please enable it in the extension settings.',
    requireInteraction: true,
    silent: false
  };
  new NotificationsMessenger().create({
    notificationId: 'user-scripts-not-available',
    options: defaultOptions
  });
}

export class UserScriptsMessenger {
  async execute({ code, ext }: IUserScriptsExecuteProps, sender: chrome.runtime.MessageSender): Promise<IUserScriptsExecuteResponse> {
    if (!(await isUserScriptsAvailable())) {
      Notify();
      throw new Error('User scripts API is not available. Ensure the extension has the necessary permissions.');
    }
    const tabId = sender.tab?.id;
    if (typeof tabId !== 'number') {
      throw new Error('Tab ID is not defined or invalid');
    }

    const results = await chrome.userScripts.execute({
      injectImmediately: true,
      target: { tabId },
      js: [{ code: `window.ext = ${JSON.stringify(ext)};` }, { code }]
    });

    if (results.length === 0) {
      throw new Error('No results returned from userScripts.execute');
    }

    return {
      result: results[0].result,
      error: results[0].error
    };
  }
}
