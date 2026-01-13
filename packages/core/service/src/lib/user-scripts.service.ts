import type { IUserScriptsExecuteProps, IUserScriptsExecuteResponse, IUserScriptsRequest } from '@dhruv-techapps/core-types';
import { CoreService } from './core-service';

export class UserScriptsService extends CoreService {
  static async execute(message: IUserScriptsExecuteProps) {
    return await this.message<IUserScriptsRequest, IUserScriptsExecuteResponse>({ messenger: 'userScripts', methodName: 'execute', message });
  }
}
