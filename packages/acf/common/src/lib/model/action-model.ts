import { generateUUID, RANDOM_UUID } from '@dhruv-techapps/core-common';

import { Addon } from './addon-model';
import { GOTO } from './common-model';
import { RETRY_OPTIONS } from './setting-model';

// Action Condition
export enum ACTION_STATUS {
  DONE = 'done',
  SKIPPED = 'skipped',
}

export enum ACTION_RUNNING {
  SKIP = 'skip',
  GOTO = 'goto',
  PROCEED = 'proceed',
}

export enum ACTION_CONDITION_OPR {
  AND = 'and',
  OR = 'or',
}

export type ActionCondition = {
  id: RANDOM_UUID;
  actionIndex?: number;
  actionId: RANDOM_UUID;
  status: ACTION_STATUS;
  operator?: ACTION_CONDITION_OPR;
};

export const getDefaultActionCondition = (actionId: RANDOM_UUID, operator?: ACTION_CONDITION_OPR): ActionCondition => ({
  id: generateUUID(),
  actionId,
  status: ACTION_STATUS.DONE,
  operator,
});

// Action Statement

export type ActionStatement = {
  conditions: Array<ActionCondition>;
  then: RETRY_OPTIONS;
  goto?: GOTO;
};

export const getDefaultActionStatement = (actionId: RANDOM_UUID, operator?: ACTION_CONDITION_OPR): ActionStatement => ({
  conditions: [getDefaultActionCondition(actionId, operator)],
  then: RETRY_OPTIONS.STOP,
});

// Action Setting
export type ActionSettings = {
  iframeFirst?: boolean;
  retry?: number;
  retryInterval?: number | string;
  retryOption?: RETRY_OPTIONS;
  retryGoto?: GOTO;
};

export const defaultActionSettings = {};

export type Action = {
  id: RANDOM_UUID;
  disabled?: boolean;
  elementFinder: string;
  actionId?: number;
  name?: string;
  initWait?: number;
  value?: string;
  repeat?: number;
  repeatInterval?: number | string;
  addon?: Addon;
  statement?: ActionStatement;
  settings?: ActionSettings;
  status?: ACTION_STATUS;
  error?: string[];
  valueFieldType?: 'text' | 'textarea';
  elementType?: string;
  selectors?: Array<Array<string>>;
};

export const getDefaultAction = (): Action => ({
  id: generateUUID(),
  elementFinder: '',
  error: ['elementFinder'],
});
