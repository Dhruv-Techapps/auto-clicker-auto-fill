import { TRandomUUID, generateUUID } from '@dhruv-techapps/core-common';
import { EActionStatus, IActionStatement } from './IActionStatement';
import { IAddon } from './IAddon';
import { EErrorOptions, TGoto } from './ICommon';
// Action Result Type for control flow
export type TActionResult = { status: EActionStatus.DONE } | { status: EActionStatus.SKIPPED } | { status: EErrorOptions.GOTO; goto: TGoto };

// Action Setting
export interface IActionSettings {
  iframeFirst?: boolean;
  retry?: number;
  retryInterval?: number | string;
  retryOption?: EErrorOptions;
  retryGoto?: TGoto;
}

export const defaultActionSettings = {};

export interface IAction {
  type?: 'action';
  id: TRandomUUID;
  disabled?: boolean;
  elementFinder: string;
  actionId?: number;
  name?: string;
  initWait?: number;
  value?: string;
  repeat?: number;
  repeatInterval?: number | string;
  addon?: IAddon;
  statement?: IActionStatement;
  settings?: IActionSettings;
  status?: EActionStatus;
  error?: string[];
  valueFieldType?: 'text' | 'textarea';
  elementType?: string;
  selectors?: Array<Array<string>>;
}

export const getDefaultAction = (elementFinder = ''): IAction => ({
  id: generateUUID(),
  elementFinder,
  error: [elementFinder === '' ? 'elementFinder' : '']
});
