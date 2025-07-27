import { IExtension } from '@dhruv-techapps/core-common';

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

export class UserScriptsMessenger {
  async execute({ code, ext }: IUserScriptsExecuteProps, sender: chrome.runtime.MessageSender): Promise<IUserScriptsExecuteResponse> {
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
