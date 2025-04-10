import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_GOOGLE_OAUTH } from './google-oauth.constant';
import { GOOGLE_SCOPES, GoogleOauth2LoginResponse, GoogleOauth2RemoveResponse } from './google-oauth.types';

export class GoogleOauthService extends CoreService {
  static async login(scopes: Array<GOOGLE_SCOPES>) {
    return await this.message<RuntimeMessageRequest<Array<GOOGLE_SCOPES>>, GoogleOauth2LoginResponse>({
      messenger: RUNTIME_MESSAGE_GOOGLE_OAUTH,
      methodName: 'login',
      message: scopes,
    });
  }
  static async logout(scopes: Array<GOOGLE_SCOPES>) {
    return await this.message<RuntimeMessageRequest<Array<GOOGLE_SCOPES>>, GoogleOauth2RemoveResponse>({
      messenger: RUNTIME_MESSAGE_GOOGLE_OAUTH,
      methodName: 'logout',
      message: scopes,
    });
  }

  static async hasAccess(scopes: Array<GOOGLE_SCOPES>) {
    return await this.message<RuntimeMessageRequest<Array<GOOGLE_SCOPES>>, GoogleOauth2LoginResponse>({ messenger: RUNTIME_MESSAGE_GOOGLE_OAUTH, methodName: 'hasAccess', message: scopes });
  }

  static async userInfo() {
    return await this.message<RuntimeMessageRequest, GoogleOauth2LoginResponse>({ messenger: RUNTIME_MESSAGE_GOOGLE_OAUTH, methodName: 'userInfo' });
  }
}
