import { GoogleOauth2Background } from '@dhruv-techapps/shared-google-oauth';
import { MicrosoftOauth2Background } from '@dhruv-techapps/shared-microsoft-oauth';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential } from 'firebase/auth/web-extension';
import { Auth, FirebaseAuthProvider, FirebaseLoginResponse, FirebaseRole, User } from './firebase-oauth.types';

export class FirebaseMultiOauth2Background {
  auth;
  googleOauth: GoogleOauth2Background;
  microsoftOauth: MicrosoftOauth2Background;

  constructor(auth: Auth, googleEdgeClientId?: string, microsoftEdgeClientId?: string) {
    this.auth = auth;
    this.googleOauth = new GoogleOauth2Background(googleEdgeClientId);
    this.microsoftOauth = new MicrosoftOauth2Background(microsoftEdgeClientId);
  }

  async firebaseIsLogin(): Promise<FirebaseLoginResponse> {
    return await this.auth.authStateReady().then(async () => {
      return await this.#getUserAndRole(this.auth.currentUser);
    });
  }

  async firebaseLogin(provider: FirebaseAuthProvider = FirebaseAuthProvider.GOOGLE, interactive = true): Promise<FirebaseLoginResponse> {
    switch (provider) {
      case FirebaseAuthProvider.GOOGLE:
        return await this.#firebaseGoogleLogin(interactive);
      case FirebaseAuthProvider.MICROSOFT:
        return await this.#firebaseMicrosoftLogin(interactive);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  async firebaseLogout(provider?: FirebaseAuthProvider) {
    if (provider === FirebaseAuthProvider.GOOGLE) {
      await this.googleOauth.logout();
    } else if (provider === FirebaseAuthProvider.MICROSOFT) {
      await this.microsoftOauth.logout();
    } else {
      // Logout from both providers if no specific provider is given
      try {
        await this.googleOauth.logout();
      } catch {
        // Ignore errors for Google logout
      }
      try {
        await this.microsoftOauth.logout();
      } catch {
        // Ignore errors for Microsoft logout
      }
    }
    await this.auth.signOut();
  }

  async _getFirebaseHeaders(provider: FirebaseAuthProvider = FirebaseAuthProvider.GOOGLE, scopes?: string[], token?: string) {
    await this.auth.authStateReady();
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not logged in');
    }
    const firebaseToken = await this.auth.currentUser?.getIdToken();
    const headers = new Headers({ Authorization: `Bearer ${firebaseToken}` });

    if (!token) {
      if (provider === FirebaseAuthProvider.GOOGLE) {
        token = (await this.googleOauth._getAuthToken({ scopes })).token;
      } else if (provider === FirebaseAuthProvider.MICROSOFT) {
        token = (await this.microsoftOauth._getAuthToken({ scopes })).token;
      }
    }
    if (token) {
      headers.append('X-Auth-Token', token);
    }
    return headers;
  }

  async #firebaseGoogleLogin(interactive = true): Promise<FirebaseLoginResponse> {
    const { token } = await this.googleOauth._getAuthToken({ interactive });
    if (token) {
      const credential = GoogleAuthProvider.credential(null, token);
      if (credential) {
        const { user } = await signInWithCredential(this.auth, credential);
        return await this.#getUserAndRole(user);
      }
      throw new Error('Error getting Google credential');
    }
    throw new Error('Error getting Google token');
  }

  async #firebaseMicrosoftLogin(interactive = true): Promise<FirebaseLoginResponse> {
    const { token } = await this.microsoftOauth._getAuthToken({ interactive });
    if (token) {
      const provider = new OAuthProvider('microsoft.com');
      const credential = OAuthProvider.credential(provider.providerId, {
        accessToken: token
      });
      if (credential) {
        const { user } = await signInWithCredential(this.auth, credential);
        return await this.#getUserAndRole(user);
      }
      throw new Error('Error getting Microsoft credential');
    }
    throw new Error('Error getting Microsoft token');
  }

  async #getUserAndRole(user: User | null): Promise<FirebaseLoginResponse> {
    if (user) {
      const decodedToken = await user.getIdTokenResult();
      return { user, role: decodedToken.claims['stripeRole'] as FirebaseRole };
    } else {
      // Try both Google and Microsoft authentication
      try {
        const googleResult = await this.#tryGoogleAuth();
        if (googleResult) return googleResult;
      } catch {
        // Continue to try Microsoft
      }

      try {
        const microsoftResult = await this.#tryMicrosoftAuth();
        if (microsoftResult) return microsoftResult;
      } catch {
        // Continue
      }
    }
    return user;
  }

  async #tryGoogleAuth(): Promise<FirebaseLoginResponse | null> {
    const { token } = await this.googleOauth._getAuthToken({ interactive: false });
    if (token) {
      const credential = GoogleAuthProvider.credential(null, token);
      if (credential) {
        const { user } = await signInWithCredential(this.auth, credential);
        return await this.#getUserAndRole(user);
      }
    }
    return null;
  }

  async #tryMicrosoftAuth(): Promise<FirebaseLoginResponse | null> {
    const { token } = await this.microsoftOauth._getAuthToken({ interactive: false });
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
    return null;
  }
}
