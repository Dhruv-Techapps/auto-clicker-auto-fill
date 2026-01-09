import { RESPONSE_CODE } from '@dhruv-techapps/core-common';

export interface GoogleOauth2LoginResponse {
  token?: string;
  grantedScopes?: string[];
}

export type GoogleOauth2RemoveResponse = RESPONSE_CODE.REMOVED;
