import { BROWSER } from '@dhruv-techapps/core-common';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications';
import { MICROSOFT_SCOPES, MicrosoftOauth2LoginResponse } from './microsoft-oauth.types';

const NOTIFICATIONS_TITLE = 'Microsoft OAuth';
const NOTIFICATIONS_ID = 'authentication';

export class MicrosoftOauth2Background {
  edgeClientId: string | undefined;
  constructor(edgeClientId?: string) {
    this.edgeClientId = edgeClientId;
  }

  async login(scopes?: Array<MICROSOFT_SCOPES>): Promise<MicrosoftOauth2LoginResponse | null> {
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

  async logout(scopes?: Array<MICROSOFT_SCOPES>) {
    const { token } = await this._getAuthToken({ scopes, interactive: false });
    if (token) {
      await chrome.identity.removeCachedAuthToken({ token });
    }
    return true;
  }

  async userInfo() {
    const { token } = await this._getAuthToken({});
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    let response = await fetch(`https://graph.microsoft.com/v1.0/me`, { headers });
    response = await response.json();
    return response;
  }

  async hasAccess(scopes: Array<string>) {
    const result = await this._getAuthToken({ scopes, interactive: false });
    return result;
  }

  async _getAuthToken({ scopes, interactive }: { scopes?: Array<string>; interactive?: boolean }): Promise<MicrosoftOauth2LoginResponse> {
    scopes = scopes || [MICROSOFT_SCOPES.PROFILE, MICROSOFT_SCOPES.EMAIL];
    if (!scopes || scopes.length === 0) {
      throw new Error('No scopes found');
    }
    try {
      const result = await this.#launchWebAuthFlow(scopes, interactive);
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
      throw new Error('Microsoft client id not found');
    }

    const url = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
    url.searchParams.append('client_id', this.edgeClientId);
    url.searchParams.append('redirect_uri', chrome.identity.getRedirectURL());
    url.searchParams.append('response_type', 'token');
    url.searchParams.append('scope', scopes.join(' '));
    url.searchParams.append('response_mode', 'fragment');

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
