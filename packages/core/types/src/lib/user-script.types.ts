import { IExtension } from '@dhruv-techapps/core-common';

export interface IUserScriptsRequest {
  messenger: 'userScripts';
  methodName: 'execute';
  message: IUserScriptsExecuteProps;
}

export interface IUserScriptsExecuteProps {
  code: string;
  ext: IExtension;
}

export interface IUserScriptsExecuteResponse {
  result: unknown;
  error?: string;
}
