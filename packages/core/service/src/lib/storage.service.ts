import type { StorageMessengerGetProps, StorageMessengerRemoveProps, StorageMessengerSetProps, StorageRequest } from '@dhruv-techapps/core-extension';
import { CoreService } from './core-service';

export class StorageService extends CoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async get<T extends string | number | symbol = string, K = any>(keys: StorageMessengerGetProps) {
    return await this.message<StorageRequest, StorageMessengerSetProps<T, K>>({ messenger: 'storage', methodName: 'get', message: keys });
  }

  static async set(items: StorageMessengerSetProps) {
    return await this.message<StorageRequest>({ messenger: 'storage', methodName: 'set', message: items });
  }

  static async remove(keys: StorageMessengerRemoveProps) {
    return await this.message<StorageRequest>({ messenger: 'storage', methodName: 'remove', message: keys });
  }
}

export class SessionStorageService extends CoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async get<T extends string | number | symbol = string, K = any>(keys: StorageMessengerGetProps) {
    return await this.message<StorageRequest, StorageMessengerSetProps<T, K>>({ messenger: 'session-storage', methodName: 'get', message: keys });
  }

  static async set(items: StorageMessengerSetProps) {
    return await this.message<StorageRequest>({ messenger: 'session-storage', methodName: 'set', message: items });
  }

  static async remove(keys: StorageMessengerRemoveProps) {
    return await this.message<StorageRequest>({ messenger: 'session-storage', methodName: 'remove', message: keys });
  }
}
