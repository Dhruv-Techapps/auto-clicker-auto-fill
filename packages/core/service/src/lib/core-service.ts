import { ConfigError } from '@dhruv-techapps/core-common';

interface CoreServiceRequest {
  messenger: string;
  methodName: string;
  message?: unknown;
  otHeaders?: Record<string, string>;
}

export class CoreService {
  static trace = false;

  static getOtHeaders = (): Record<string, string> | undefined => {
    return window.ext.__actionHeaders || window.ext.__batchHeaders || window.ext.__configHeaders;
  };

  static messageChrome<K extends CoreServiceRequest, T = void>(message: K): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        if (!chrome.runtime?.sendMessage) {
          reject(new Error('Extension context invalidated'));
          return;
        }

        const id = chrome.runtime.id || window.EXTENSION_ID;
        if (!id || typeof id !== 'string') {
          reject(new Error('extensionId is not defined or not a string'));
          return;
        }
        if (this.trace) {
          message.otHeaders = this.getOtHeaders();
        }
        // This line is kept for debugging purpose
        // console.debug(`${message.messenger}.${message.methodName}`, message.message);
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
  private static readonly DEFAULT_NAME = 'Auto Clicker & Auto Fill';
  private static readonly instances: Map<string, PortService> = new Map();

  private readonly port: chrome.runtime.Port;
  public readonly portName: string;
  private disconnected = false;

  private constructor(name = PortService.DEFAULT_NAME) {
    if (!chrome.runtime?.connect) {
      throw new Error('Extension context invalidated');
    }

    const id = chrome.runtime.id || globalThis.EXTENSION_ID;
    if (!id || typeof id !== 'string') {
      throw new Error('extensionId is not defined or not a string');
    }

    this.portName = name;
    this.port = chrome.runtime.connect(id, { name: this.portName });

    // When port disconnects, remove from instances map so a new instance may be created later
    this.port.onDisconnect.addListener(() => {
      this.disconnected = true;
      console.log(`Port "${this.portName}" disconnected — clearing instance`);
      PortService.instances.delete(this.portName);
    });
  }

  /**
   * Returns a PortService instance scoped to the given name.
   * If an instance for that name was previously created and still connected, returns it.
   * Otherwise creates a new one.
   */
  static getInstance(name?: string): PortService {
    const key = name ?? PortService.DEFAULT_NAME;
    const existing = PortService.instances.get(key);

    if (existing && !existing.disconnected) {
      return existing;
    }

    const instance = new PortService(key);
    PortService.instances.set(key, instance);
    return instance;
  }

  private postMessage(message: unknown): void {
    if (this.disconnected) {
      throw new Error(`Cannot postMessage: port "${this.portName}" is disconnected`);
    }
    this.port.postMessage(message);
  }

  public onMessage(listener: (message: unknown) => void): void {
    if (!this.port.onMessage.hasListener(listener)) {
      this.port.onMessage.addListener(listener);
    }
  }

  public onDisconnect(listener: () => void): void {
    this.port.onDisconnect.addListener(listener);
  }

  public disconnect(): void {
    if (this.disconnected) return;
    try {
      this.port.disconnect();
    } finally {
      // if onDisconnect listener from chrome doesn't fire synchronously, ensure cleanup
      this.disconnected = true;
      PortService.instances.delete(this.portName);
      console.log(`Port "${this.portName}" manually disconnected and cleared.`);
    }
  }

  public message<K extends CoreServiceRequest>(message: K): void {
    this.postMessage(message);
  }
}
