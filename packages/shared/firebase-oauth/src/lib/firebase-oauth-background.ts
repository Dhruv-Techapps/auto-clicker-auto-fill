import { context, propagation } from '@dhruv-techapps/core-open-telemetry/background';
import { DeviceStorage } from '@dhruv-techapps/core-store';
import { GoogleOauth2Background } from '@dhruv-techapps/shared-google-oauth';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth/web-extension';
import { Auth, FirebaseLoginResponse, FirebaseRole, User } from './firebase-oauth.types';

export class FirebaseOauth2Background extends GoogleOauth2Background {
  auth;
  constructor(auth: Auth, edgeClientId?: string) {
    super(edgeClientId);
    this.auth = auth;
  }

  async firebaseIsLogin(): Promise<FirebaseLoginResponse> {
    return await this.auth.authStateReady().then(async () => {
      return await this.#getUserAndRole(this.auth.currentUser);
    });
  }

  async firebaseLogin(interactive = true): Promise<FirebaseLoginResponse> {
    const { token } = await this._getAuthToken({ interactive });
    if (token) {
      const credential = GoogleAuthProvider.credential(null, token);
      if (credential) {
        const { user } = await signInWithCredential(this.auth, credential);
        return await this.#getUserAndRole(user);
      }
      throw new Error('Error getting credential');
    }
    throw new Error('Error getting token');
  }

  async firebaseLogout() {
    await this.logout();
    await this.auth.signOut();
  }

  setTraceparent(headers: Headers) {
    const carrier: { traceparent?: string } = {};
    propagation.inject(context.active(), carrier);
    const traceparent = carrier.traceparent;
    if (traceparent) {
      headers.append('traceparent', traceparent);
    }
  }

  async setSessionId(headers: Headers) {
    const result = await chrome.storage.session.get<{ sessionData: { session_id: string; timestamp: number } | null }>('sessionData');
    const sessionId = result.sessionData?.session_id;
    if (sessionId) {
      headers.append('X-Session-Id', sessionId);
    }
  }

  async setDeviceAndVersion(headers: Headers) {
    const deviceInfo = await DeviceStorage.getDeviceInfo();
    headers.append('X-Device-Id', deviceInfo.id);
    const version = chrome.runtime.getManifest().version;
    headers.append('X-Extension-Version', version);
  }

  async _getFirebaseHeaders(scopes?: string[], gToken?: string) {
    const headers = new Headers();
    this.setTraceparent(headers);
    await this.setDeviceAndVersion(headers);
    await this.setSessionId(headers);
    await this.auth.authStateReady();
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not logged in');
    }
    const token = await this.auth.currentUser?.getIdToken();
    headers.append('Authorization', `Bearer ${token}`);
    if (!gToken) {
      gToken = (await this._getAuthToken({ scopes })).token;
    }
    if (gToken) {
      headers.append('X-Auth-Token', gToken);
    }
    return headers;
  }

  async #getUserAndRole(user: User | null): Promise<FirebaseLoginResponse> {
    if (user) {
      const decodedToken = await user.getIdTokenResult();
      return { user, role: decodedToken.claims['stripeRole'] as FirebaseRole };
    } else {
      try {
        const { token } = await this._getAuthToken({ interactive: false });
        if (token) {
          const credential = GoogleAuthProvider.credential(null, token);
          if (credential) {
            const { user } = await signInWithCredential(this.auth, credential);
            return await this.#getUserAndRole(user);
          }
        }
      } catch {
        return user;
      }
    }
    return user;
  }
}
