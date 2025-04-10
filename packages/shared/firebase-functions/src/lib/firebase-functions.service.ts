import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_FUNCTIONS } from './firebase-functions.constant';

export class FirebaseFunctionsService extends CoreService {
  static async vision() {
    return await this.message<RuntimeMessageRequest, string>({ messenger: RUNTIME_MESSAGE_FIREBASE_FUNCTIONS, methodName: 'visionImagesAnnotate' });
  }

  static async getValues<Req, Res>(message: Req) {
    return await this.message<RuntimeMessageRequest<Req>, Res>({ messenger: RUNTIME_MESSAGE_FIREBASE_FUNCTIONS, methodName: 'getValues', message });
  }
}
