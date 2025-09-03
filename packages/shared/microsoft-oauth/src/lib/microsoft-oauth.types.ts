import { RESPONSE_CODE } from '@dhruv-techapps/core-common';

export enum MICROSOFT_SCOPES {
  EMAIL = 'https://graph.microsoft.com/User.Read',
  OPENID = 'openid',
  OFFLINE_ACCESS = 'offline_access'
}

export interface MicrosoftOauth2LoginResponse {
  token?: string;
  grantedScopes?: string[];
}

export type MicrosoftOauth2RemoveResponse = RESPONSE_CODE.REMOVED;

export abstract class MicrosoftOauth2Service {
  abstract login(): Promise<MicrosoftOauth2LoginResponse>;
  abstract remove(): Promise<MicrosoftOauth2RemoveResponse>;
}
