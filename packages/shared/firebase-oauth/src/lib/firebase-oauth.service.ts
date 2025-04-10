import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_OAUTH } from './firebase-oauth.constant';
import { FirebaseLoginResponse } from './firebase-oauth.types';

export class FirebaseOauthService extends CoreService {
  static async isLogin() {
    return await this.message<RuntimeMessageRequest, FirebaseLoginResponse>({ messenger: RUNTIME_MESSAGE_FIREBASE_OAUTH, methodName: 'firebaseIsLogin' });
  }

  static async login() {
    return await this.message<RuntimeMessageRequest, FirebaseLoginResponse>({ messenger: RUNTIME_MESSAGE_FIREBASE_OAUTH, methodName: 'firebaseLogin' });
  }

  static async logout() {
    return await this.message({ messenger: RUNTIME_MESSAGE_FIREBASE_OAUTH, methodName: 'firebaseLogout' });
  }
}
