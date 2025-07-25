import { UserScriptsRequest, UserScriptsResponse } from '@dhruv-techapps/core-extension';
import { CoreService } from './service';

export class UserScriptsService extends CoreService {
  static async execute(code: string) {
    return await this.message<UserScriptsRequest, UserScriptsResponse>({ messenger: 'userScripts', methodName: 'execute', message: code });
  }
}
