import { ConfigError } from '@dhruv-techapps/core-common';

interface CoreServiceRequest {
  messenger: string;
  methodName: string;
  message?: unknown;
}

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

export class PortService {
  private static instance?: PortService;
  private readonly port: chrome.runtime.Port;
  private readonly portName: string;

  private constructor(name: string = 'Auto Clicker & Auto Fill') {
    if (!chrome.runtime?.connect) {
      throw new Error('Extension context invalidated');
    }

    const id = chrome.runtime.id || window.EXTENSION_ID;
    if (!id || typeof id !== 'string') {
      throw new Error('extensionId is not undefined neither string');
    }

    this.portName = name;
    this.port = chrome.runtime.connect(id, { name: this.portName });
  }

  static getInstance(name?: string): PortService {
    if (!PortService.instance) {
      PortService.instance = new PortService(name);
      return PortService.instance;
    }

    if (name && PortService.instance.portName !== name) {
      console.warn(`PortService already initialized with name "${PortService.instance.portName}". Ignoring request for "${name}".`);
    }

    return PortService.instance;
  }

  private postMessage(message: unknown): void {
    this.port.postMessage(message);
  }

  public onMessage(listener: (message: unknown) => void): void {
    if (this.port.onMessage.hasListener(listener)) {
      return;
    }
    this.port.onMessage.addListener(listener);
  }

  public disconnect(): void {
    this.port.disconnect();
  }

  public onDisconnect(listener: () => void): void {
    this.port.onDisconnect.addListener(listener);
  }

  public message<K extends CoreServiceRequest>(message: K): void {
    this.postMessage(message);
  }
}
