import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_STORAGE } from './firebase-storage.constant';

export class FirebaseStorageService extends CoreService {
  static async downloadFile<T>(path: string) {
    return await this.message<RuntimeMessageRequest<string>, T>({ messenger: RUNTIME_MESSAGE_FIREBASE_STORAGE, methodName: 'downloadFile', message: path });
  }
}
