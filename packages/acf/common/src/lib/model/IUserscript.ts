import { generateUUID, TRandomUUID } from '@dhruv-techapps/core-common';
import { EActionStatus, IActionSettings, IActionStatement } from './IAction';
import { IAddon } from './IAddon';

export interface IUserScript {
  type: 'userscript';
  name?: string;
  id: TRandomUUID;
  disabled?: boolean;
  actionId?: number;
  error?: string[];
  addon?: IAddon;
  value: string;
  statement?: IActionStatement;
  valueFieldType?: 'script';
  settings?: IActionSettings;
  status?: EActionStatus;
  initWait?: number;
}
export const getDefaultUserscript = (): IUserScript => ({
  id: generateUUID(),
  name: 'Userscript',
  value: '(function() {\n  // Your script here\n})();',
  type: 'userscript',
  valueFieldType: 'script'
});
