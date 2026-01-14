import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_OAUTH } from './lib/firebase-oauth.constant';
import type { FirebaseLoginResponse } from './lib/firebase-oauth.types';

export type { FirebaseRole, User } from './lib/firebase-oauth.types';

export class FirebaseOauthService extends CoreService {
  static override readonly trace = true;
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
