import { CoreService } from './service';
import { StorageMessengerGetProps, StorageMessengerRemoveProps, StorageMessengerSetProps } from '@dhruv-techapps/core-extension';

export class StorageService extends CoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async get<T = any>(extensionId: string, keys: StorageMessengerGetProps): Promise<T> {
    return await this.message<T>(extensionId, { messenger: 'storage', methodName: 'get', message: keys });
  }

  static async set(extensionId: string, items: StorageMessengerSetProps) {
    return await this.message(extensionId, { messenger: 'storage', methodName: 'set', message: items });
  }

  static async remove(extensionId: string, keys: StorageMessengerRemoveProps) {
    return await this.message(extensionId, { messenger: 'storage', methodName: 'remove', message: keys });
  }
}
