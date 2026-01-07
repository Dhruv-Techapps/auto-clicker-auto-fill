import { IUserScriptsExecuteProps, IUserScriptsExecuteResponse, IUserScriptsRequest } from '@dhruv-techapps/core-extension';
import { CoreService } from './core-service';

export class UserScriptsService extends CoreService {
  static async execute(message: IUserScriptsExecuteProps) {
    return await this.message<IUserScriptsRequest, IUserScriptsExecuteResponse>({ messenger: 'userScripts', methodName: 'execute', message });
  }
}
