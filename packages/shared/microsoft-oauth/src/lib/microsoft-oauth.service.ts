import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_MICROSOFT_OAUTH } from './microsoft-oauth.constant';
import { MICROSOFT_SCOPES, MicrosoftOauth2LoginResponse, MicrosoftOauth2RemoveResponse } from './microsoft-oauth.types';

export class MicrosoftOauthService extends CoreService {
  static async login(scopes: Array<MICROSOFT_SCOPES>) {
    return await this.message<RuntimeMessageRequest<Array<MICROSOFT_SCOPES>>, MicrosoftOauth2LoginResponse>({
      messenger: RUNTIME_MESSAGE_MICROSOFT_OAUTH,
      methodName: 'login',
      message: scopes
    });
  }
  static async logout(scopes: Array<MICROSOFT_SCOPES>) {
    return await this.message<RuntimeMessageRequest<Array<MICROSOFT_SCOPES>>, MicrosoftOauth2RemoveResponse>({
      messenger: RUNTIME_MESSAGE_MICROSOFT_OAUTH,
      methodName: 'logout',
      message: scopes
    });
  }

  static async hasAccess(scopes: Array<MICROSOFT_SCOPES>) {
    return await this.message<RuntimeMessageRequest<Array<MICROSOFT_SCOPES>>, MicrosoftOauth2LoginResponse>({ messenger: RUNTIME_MESSAGE_MICROSOFT_OAUTH, methodName: 'hasAccess', message: scopes });
  }

  static async userInfo() {
    return await this.message<RuntimeMessageRequest, MicrosoftOauth2LoginResponse>({ messenger: RUNTIME_MESSAGE_MICROSOFT_OAUTH, methodName: 'userInfo' });
  }
}