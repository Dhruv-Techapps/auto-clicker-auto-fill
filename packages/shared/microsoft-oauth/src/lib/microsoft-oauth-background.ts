/// <reference types="chrome"/>

import { NotificationHandler } from '@dhruv-techapps/shared-notifications';
import { MICROSOFT_SCOPES, MicrosoftOauth2LoginResponse, MicrosoftOauth2RemoveResponse } from './microsoft-oauth.types';
import { RESPONSE_CODE } from '@dhruv-techapps/core-common';

const NOTIFICATIONS_ID = 'microsoft-oauth';
const NOTIFICATIONS_TITLE = 'Microsoft OAuth';
const BROWSER = process.env['NX_BROWSER'] || 'CHROME';

export class MicrosoftOauth2Background {
  edgeClientId: string | undefined;
  constructor(edgeClientId?: string) {
    this.edgeClientId = edgeClientId;
  }

  async login(scopes?: Array<MICROSOFT_SCOPES>): Promise<MicrosoftOauth2LoginResponse | null> {
    if (!scopes || scopes.length === 0) {
      return null;
    }
    try {
      const result = await this._getAuthToken({ scopes, interactive: true });
      return result;
    } catch (error) {
      console.error('Microsoft OAuth login error', error);
      return null;
    }
  }

  async logout(scopes?: Array<MICROSOFT_SCOPES>) {
    if (!scopes || scopes.length === 0) {
      return RESPONSE_CODE.REMOVED;
    }
    try {
      if (BROWSER === 'EDGE') {
        // For Edge, we need to revoke tokens manually
        const result = await this._getAuthToken({ scopes, interactive: false });
        if (result?.token) {
          // Revoke the access token
          await fetch(`https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(chrome.identity.getRedirectURL())}`);
        }
      } else {
        await chrome.identity.removeCachedAuthToken({ token: '' });
      }
      return RESPONSE_CODE.REMOVED;
    } catch (error) {
      console.error('Microsoft OAuth logout error', error);
      return RESPONSE_CODE.REMOVED;
    }
  }

  async userInfo() {
    try {
      const result = await this._getAuthToken({ scopes: [MICROSOFT_SCOPES.PROFILE], interactive: false });
      if (result?.token) {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            Authorization: `Bearer ${result.token}`
          }
        });
        const userInfo = await response.json();
        return { ...result, userInfo };
      }
      return result;
    } catch (error) {
      console.error('Microsoft OAuth userInfo error', error);
      return null;
    }
  }

  async hasAccess(scopes: Array<string>) {
    try {
      const result = await this._getAuthToken({ scopes, interactive: false });
      return result;
    } catch (error) {
      console.error('Microsoft OAuth hasAccess error', error);
      return null;
    }
  }

  async _getAuthToken({ scopes, interactive }: { scopes?: Array<string>; interactive?: boolean }): Promise<MicrosoftOauth2LoginResponse> {
    if (!scopes || scopes.length === 0) {
      throw new Error('No scopes found');
    }
    try {
      const result = BROWSER === 'EDGE' ? await this.#launchWebAuthFlow(scopes, interactive) : await this.#chromeIdentityFlow(scopes, interactive);
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

  async #chromeIdentityFlow(scopes: string[], interactive?: boolean): Promise<MicrosoftOauth2LoginResponse> {
    // Note: Chrome identity API doesn't natively support Microsoft OAuth
    // This would need to use the launchWebAuthFlow approach
    return await this.#launchWebAuthFlow(scopes, interactive);
  }

  async #launchWebAuthFlow(scopes: string[], interactive?: boolean): Promise<MicrosoftOauth2LoginResponse> {
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
    }
    throw new Error('Could not authenticate');
  }
}