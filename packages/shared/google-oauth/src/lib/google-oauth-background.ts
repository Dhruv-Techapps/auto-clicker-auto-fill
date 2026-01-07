import { BROWSER } from '@dhruv-techapps/core-common';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications/handler';
import { GOOGLE_SCOPES, GoogleOauth2LoginResponse } from './google-oauth.types';

const NOTIFICATIONS_TITLE = 'Google OAuth';
const NOTIFICATIONS_ID = 'authentication';

export class GoogleOauth2Background {
  edgeClientId: string | undefined;
  constructor(edgeClientId?: string) {
    this.edgeClientId = edgeClientId;
  }

  async login(scopes?: Array<GOOGLE_SCOPES>): Promise<GoogleOauth2LoginResponse | null> {
    try {
      const result = await this._getAuthToken({ scopes, interactive: true });
      return result;
    } catch (error) {
      if (error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
      }
      await this.logout(scopes);
      throw error;
    }
  }

  async logout(scopes?: Array<GOOGLE_SCOPES>) {
    const { token } = await this._getAuthToken({ scopes, interactive: false });
    if (token) {
      await chrome.identity.removeCachedAuthToken({ token });
    }
    return true;
  }

  async userInfo() {
    const { token } = await this._getAuthToken({});
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    let response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, { headers });
    response = await response.json();
    return response;
  }

  async hasAccess(scopes: Array<string>) {
    const result = await this._getAuthToken({ scopes, interactive: false });
    return result;
  }

  async _getAuthToken({ scopes, interactive }: { scopes?: Array<string>; interactive?: boolean }): Promise<GoogleOauth2LoginResponse> {
    scopes = scopes || chrome.runtime.getManifest().oauth2?.scopes;
    if (!scopes || scopes.length === 0) {
      throw new Error('No scopes found');
    }
    try {
      const result = BROWSER === 'EDGE' ? await this.#launchWebAuthFlow(scopes, interactive) : await chrome.identity.getAuthToken({ scopes, interactive });
      return result;
    } catch (error) {
      if (error instanceof Error && interactive) {
        if (error.message === 'Invalid Credentials' || error.message === 'invalid authentication credentials') {
          await this.logout();
          const result = await this._getAuthToken({ scopes, interactive });
          return result;
        } else {
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
        }
      }
      throw error;
    }
  }

  async #launchWebAuthFlow(scopes: string[], interactive?: boolean) {
    if (this.edgeClientId === undefined) {
      throw new Error('Edge client id not found');
    }

    const url = new URL('https://accounts.google.com/o/oauth2/auth');
    url.searchParams.append('client_id', this.edgeClientId);
    url.searchParams.append('redirect_uri', chrome.identity.getRedirectURL());
    url.searchParams.append('response_type', 'token');
    url.searchParams.append('scope', scopes.join(' '));

    const result = await chrome.identity.launchWebAuthFlow({
      url: url.href,
      interactive
    });
    if (result) {
      const url = new URL(result);
      const token = url?.hash
        ?.split('&')
        .find((param) => param.startsWith('#access_token='))
        ?.split('=')[1];
      if (token) {
        return { token, grantedScopes: scopes };
      }
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Token not found');
      throw new Error('Token not found');
    }
    NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Error while retrieving token');
    throw new Error('Error while retrieving token');
  }
}
