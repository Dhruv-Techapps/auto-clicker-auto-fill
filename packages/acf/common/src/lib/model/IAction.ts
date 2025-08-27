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

export enum EActionWatchRestartMode {
  SINGLE = 'single',               // Re-execute only this action (default)
  SEQUENCE = 'sequence',           // Restart from this action and continue sequence
  FULL = 'full'                    // Restart entire action sequence from beginning
}

// Action Watch Settings
export interface IActionWatchSettings {
  watchEnabled?: boolean;           // Enable DOM watching for this action
  watchRootSelector?: string;       // Container to observe (default: 'body')
  debounceMs?: number;             // Debounce delay in milliseconds (default: 500)
  maxRepeats?: number;             // Max times to process same element (default: 1)
  visibilityCheck?: boolean;       // Only process visible elements (default: false)
  restartMode?: EActionWatchRestartMode; // How to restart when triggered (default: SINGLE)
  lifecycleStopConditions?: {      // Auto-stop conditions
    timeout?: number;              // Stop after N milliseconds
    maxProcessed?: number;         // Stop after N elements processed
    urlChange?: boolean;           // Stop on URL change (default: true)
  };
}

// Action Setting
export interface IActionSettings {
  iframeFirst?: boolean;
  retry?: number;
  retryInterval?: number | string;
  retryOption?: ERetryOptions;
  retryGoto?: TGoto;
  watch?: IActionWatchSettings;    // DOM watch configuration
}

export const defaultActionWatchSettings: IActionWatchSettings = {
  watchEnabled: false,
  watchRootSelector: 'body',
  debounceMs: 500,
  maxRepeats: 1,
  visibilityCheck: false,
  restartMode: EActionWatchRestartMode.SINGLE,
  lifecycleStopConditions: {
    timeout: 30 * 60 * 1000, // 30 minutes
    urlChange: true
  }
};

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
