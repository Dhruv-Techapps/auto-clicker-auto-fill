import type { StorageMessengerGetProps, StorageMessengerRemoveProps, StorageMessengerSetProps } from '@dhruv-techapps/core-types';

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
