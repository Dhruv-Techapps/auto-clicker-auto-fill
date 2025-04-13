import { RESPONSE_CODE } from '@dhruv-techapps/core-common';

export enum GOOGLE_SCOPES {
  SHEETS = 'https://www.googleapis.com/auth/spreadsheets.readonly',
  PROFILE = 'https://www.googleapis.com/auth/userinfo.profile',
  DRIVE = 'https://www.googleapis.com/auth/drive.appdata',
  EMAIL = 'https://www.googleapis.com/auth/userinfo.email'
}

export type GoogleOauth2LoginResponse = {
  token?: string;
  grantedScopes?: string[];
};

export type GoogleOauth2RemoveResponse = RESPONSE_CODE.REMOVED;

export abstract class GoogleOauth2Service {
  abstract login(): Promise<GoogleOauth2LoginResponse>;
  abstract remove(): Promise<GoogleOauth2RemoveResponse>;
}
