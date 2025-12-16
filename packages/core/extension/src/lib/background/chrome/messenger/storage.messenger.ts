// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StorageMessengerSetProps<T extends string | number | symbol = string, K = any> = {
  [key in T]: K;
};

export type StorageMessengerGetProps = string | string[] | StorageMessengerSetProps | null | undefined;

export type StorageMessengerRemoveProps = string | string[];

export interface StorageRequest {
  messenger: 'storage' | 'session-storage';
  methodName: 'get' | 'set' | 'remove';
  message: StorageMessengerGetProps | StorageMessengerSetProps | StorageMessengerRemoveProps;
}

export class StorageMessenger {
  async get(keys: StorageMessengerGetProps): Promise<StorageMessengerSetProps> {
    return chrome.storage.local.get(keys);
  }

  async set(items: StorageMessengerSetProps): Promise<void> {
    return chrome.storage.local.set(items);
  }

  async remove(keys: StorageMessengerRemoveProps): Promise<void> {
    return chrome.storage.local.remove(keys);
  }
}

export class SessionStorageMessenger {
  async get(keys: StorageMessengerGetProps): Promise<StorageMessengerSetProps> {
    return chrome.storage.session.get(keys);
  }

  async set(items: StorageMessengerSetProps): Promise<void> {
    return chrome.storage.session.set(items);
  }

  async remove(keys: StorageMessengerRemoveProps): Promise<void> {
    return chrome.storage.session.remove(keys);
  }
}
