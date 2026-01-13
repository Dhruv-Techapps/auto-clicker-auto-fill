import { TRandomUUID, generateUUID } from '@dhruv-techapps/core-common';

import { IAddon } from './IAddon';
import { ERetryOptions } from './ISetting';
import { TGoto } from './TGoto';

// Action Condition
export enum EActionStatus {
  DONE = 'done',
  SKIPPED = 'skipped'
}

export enum EActionRunning {
  SKIP = 'skip',
  GOTO = 'goto',
  PROCEED = 'proceed'
}

// Action Result Type for control flow
export type TActionResult =
  | { status: EActionStatus.DONE }
  | { status: EActionStatus.SKIPPED }
  | { status: EActionRunning.GOTO; goto: TGoto };

export enum EActionConditionOperator {
  AND = 'and',
  OR = 'or'
}

export interface IActionCondition {
  id: TRandomUUID;
  actionIndex?: number;
  actionId: TRandomUUID;
  status: EActionStatus;
  operator?: EActionConditionOperator;
}

export const getDefaultActionCondition = (actionId: TRandomUUID, operator?: EActionConditionOperator): IActionCondition => ({
  id: generateUUID(),
  actionId,
  status: EActionStatus.DONE,
  operator
});

// Action Statement

export interface IActionStatement {
  conditions: Array<IActionCondition>;
  then: ERetryOptions;
  goto?: TGoto;
}

export const getDefaultActionStatement = (actionId: TRandomUUID, operator?: EActionConditionOperator): IActionStatement => ({
  conditions: [getDefaultActionCondition(actionId, operator)],
  then: ERetryOptions.STOP
});

// Action Setting
export interface IActionSettings {
  iframeFirst?: boolean;
  retry?: number;
  retryInterval?: number | string;
  retryOption?: ERetryOptions;
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
