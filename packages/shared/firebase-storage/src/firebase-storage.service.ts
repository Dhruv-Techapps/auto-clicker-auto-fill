import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_STORAGE } from './lib/firebase-storage.constant';

export class FirebaseStorageService extends CoreService {
  static override trace = true;
  static async downloadFile<T>(path: string) {
    return await this.message<RuntimeMessageRequest<string>, T>({ messenger: RUNTIME_MESSAGE_FIREBASE_STORAGE, methodName: 'downloadFile', message: path });
  }
}
