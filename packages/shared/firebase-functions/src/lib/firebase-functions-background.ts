import { Auth, FirebaseOauth2Background } from '@dhruv-techapps/shared-firebase-oauth';
import { GOOGLE_SCOPES } from '@dhruv-techapps/shared-google-oauth';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications';
import { NOTIFICATIONS_ID } from './firebase-functions.constant';

export class FirebaseFunctionsBackground extends FirebaseOauth2Background {
  cloudFunctionUrl: string;
  version = '/api/v4';
  constructor(auth: Auth, cloudFunctionUrl: string, edgeClientId?: string | undefined) {
    super(auth, edgeClientId);
    this.cloudFunctionUrl = cloudFunctionUrl;
  }

  async visionImagesAnnotate<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders();
    const url = new URL(this.cloudFunctionUrl + this.version + '/vision/images:annotate');
    const response = await this.#fetch(url, headers, data);
    return response;
  }
  async openAiChat<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders();
    const url = new URL(this.cloudFunctionUrl + this.version + '/openai/chat');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async getValues<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.SHEETS]);
    const url = new URL(this.cloudFunctionUrl + this.version + '/sheets/values');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async discordNotify<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders();
    const url = new URL(this.cloudFunctionUrl + this.version + '/discord/notify');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async discordUser<Res>(token?: string): Promise<Res> {
    const url = new URL(this.cloudFunctionUrl + this.version + '/discord/user');
    const headers = await this._getFirebaseHeaders(undefined, token); // Cast the token argument to string
    const response = await this.#fetch(url, headers);
    return response;
  }

  async driveList<Res>(): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + this.version + '/drive');
    const response = await this.#fetch(url, headers, undefined, 'GET');
    return response;
  }

  async driveGet<Req extends { id: string }, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + this.version + `/drive/${data.id}`);
    const response = await this.#fetch(url, headers, data, 'GET');
    return response;
  }

  async driveDelete<Req extends { id: string }, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + this.version + `/drive/${data.id}`);
    const response = await this.#fetch(url, headers, data, 'DELETE');
    return response;
  }

  async driveCreate<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + this.version + '/drive');
    const response = await this.#fetch(url, headers, data, 'POST');
    return response;
  }

  async driveUpdate<Req extends { id: string }, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + this.version + `/drive/${data.id}`);
    const response = await this.#fetch(url, headers, data, 'PATCH');
    return response;
  }

  async #fetch(url: URL, headers: Headers, data?: unknown, method: 'POST' | 'GET' | 'DELETE' | 'PATCH' = 'POST') {
    try {
      const init: RequestInit = { method, headers };
      if (data && (method === 'POST' || method === 'PATCH' || method === 'DELETE')) {
        init.body = JSON.stringify(data);
      }

      const response = await fetch(url.href, init);
      const result = await response.json();
      if (result.error) {
        throw new CustomError(result.error, result.message);
      }
      return result;
    } catch (error) {
      if (error instanceof CustomError || error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, error.name, error.message, true);
      }
      throw error;
    }
  }
}

class CustomError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}
