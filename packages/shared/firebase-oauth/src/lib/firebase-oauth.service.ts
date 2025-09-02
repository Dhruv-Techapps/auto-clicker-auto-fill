import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_FIREBASE_OAUTH } from './firebase-oauth.constant';
import { FirebaseAuthProvider, FirebaseLoginResponse } from './firebase-oauth.types';

export class FirebaseOauthService extends CoreService {
  static async isLogin() {
    return await this.message<RuntimeMessageRequest, FirebaseLoginResponse>({ messenger: RUNTIME_MESSAGE_FIREBASE_OAUTH, methodName: 'firebaseIsLogin' });
  }

  static async login(provider: FirebaseAuthProvider = FirebaseAuthProvider.GOOGLE) {
    return await this.message<RuntimeMessageRequest<FirebaseAuthProvider>, FirebaseLoginResponse>({ 
      messenger: RUNTIME_MESSAGE_FIREBASE_OAUTH, 
      methodName: 'firebaseLogin',
      message: provider
    });
  }

  static async logout(provider?: FirebaseAuthProvider) {
    return await this.message<RuntimeMessageRequest<FirebaseAuthProvider | undefined>, void>({ 
      messenger: RUNTIME_MESSAGE_FIREBASE_OAUTH, 
      methodName: 'firebaseLogout',
      message: provider
    });
  }
}
