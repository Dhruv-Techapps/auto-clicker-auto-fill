import { TRandomUUID, generateUUID } from '@dhruv-techapps/core-common';
import { EActionStatus, IActionStatement } from './IActionStatement';
import { IAddon } from './IAddon';
import { EErrorOptions, TBoundedValue, TGoto } from './ICommon';

// Action Setting
export interface IActionSettings {
  iframeFirst?: boolean;
  retry?: TBoundedValue;
  retryInterval?: number;
  retryIntervalTo?: number;
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
  initWaitTo?: number;
  value?: string;
  repeat?: number;
  repeatInterval?: number;
  repeatIntervalTo?: number;
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
