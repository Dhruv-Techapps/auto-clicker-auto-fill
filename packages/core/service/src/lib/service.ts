import { ConfigError } from '@dhruv-techapps/core-common';

type CoreServiceRequest = {
  messenger: string;
  methodName: string;
  message?: unknown;
};

export class CoreService {
  static messageChrome<K extends CoreServiceRequest, T = void>(message: K): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        if (!chrome.runtime?.sendMessage) {
          reject(new Error('Extension context invalidated'));
          return;
        }

        const id = chrome.runtime.id || window.EXTENSION_ID;
        if (!id || typeof id !== 'string') {
          reject(new Error('extensionId is not undefined neither string'));
          return;
        }
        // This line is kept for debugging purpose console.debug(`${message.messenger}.${message.methodName}`, message.message);
        chrome.runtime.sendMessage(id, message, (response) => {
          if (chrome.runtime.lastError || response?.error) {
            const error: string = chrome.runtime.lastError?.message ?? response?.error;
            console.error(error);
            if (error.includes('User not logged in')) {
              reject(new ConfigError('Authentication', error));
            }
            reject(new Error(error));
          } else {
            // This line is kept for debugging purpose console.debug(response);
            resolve(response);
          }
        });
      } catch (error) {
        console.warn(error);
      }
    });
  }

  static async message<K extends CoreServiceRequest, T = void>(message: K): Promise<T> {
    return await this.messageChrome<K, T>(message);
  }
}
