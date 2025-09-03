import { MicrosoftOauth2Background } from '@dhruv-techapps/shared-microsoft-oauth';
import { OAuthProvider, signInWithCredential } from 'firebase/auth/web-extension';
import { Auth, FirebaseLoginResponse, FirebaseRole, User } from './firebase-oauth.types';

export class FirebaseMicrosoftOauth2Background extends MicrosoftOauth2Background {
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
      const provider = new OAuthProvider('microsoft.com');
      const credential = OAuthProvider.credential(provider.providerId, {
        accessToken: token
      });
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

  async _getFirebaseHeaders(scopes?: string[], msToken?: string) {
    await this.auth.authStateReady();
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not logged in');
    }
    const token = await this.auth.currentUser?.getIdToken();
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    if (!msToken) {
      msToken = (await this._getAuthToken({ scopes })).token;
    }
    if (msToken) {
      headers.append('X-Auth-Token', msToken);
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
          const provider = new OAuthProvider('microsoft.com');
          const credential = OAuthProvider.credential(provider.providerId, {
            accessToken: token
          });
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
