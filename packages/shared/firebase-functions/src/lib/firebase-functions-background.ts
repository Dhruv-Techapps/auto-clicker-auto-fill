import { Auth, FirebaseOauth2Background } from '@dhruv-techapps/shared-firebase-oauth';
import { GOOGLE_SCOPES } from '@dhruv-techapps/shared-google-oauth';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications';
import { NOTIFICATIONS_ID } from './firebase-functions.constant';

export class FirebaseFunctionsBackground extends FirebaseOauth2Background {
  cloudFunctionUrl: string;

  constructor(auth: Auth, cloudFunctionUrl: string, edgeClientId?: string | undefined) {
    super(auth, edgeClientId);
    this.cloudFunctionUrl = cloudFunctionUrl;
  }

  async visionImagesAnnotate<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders();
    const url = new URL(this.cloudFunctionUrl + '/visionImagesAnnotate');
    const response = await this.#fetch(url, headers, data);
    return response;
  }
  async openAiChat<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders();
    const url = new URL(this.cloudFunctionUrl + '/openAiChat');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async getValues<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.SHEETS]);
    const url = new URL(this.cloudFunctionUrl + '/sheetsValues');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async discordNotify<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders();
    const url = new URL(this.cloudFunctionUrl + '/discordNotify');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async discordUser<Res>(token?: string): Promise<Res> {
    const url = new URL(this.cloudFunctionUrl + '/discordUser');
    const headers = await this._getFirebaseHeaders(undefined, token); // Cast the token argument to string
    const response = await this.#fetch(url, headers);
    return response;
  }

  async driveList<Res>(): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + '/driveList');
    const response = await this.#fetch(url, headers);
    return response;
  }

  async driveGet<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + '/driveGet');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async driveDelete<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + '/driveDelete');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async driveCreateOrUpdate<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + '/driveCreateOrUpdate');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async #fetch(url: URL, headers: Headers, data?: unknown) {
    try {
      const init: RequestInit = { method: 'POST', headers };
      if (data) {
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
