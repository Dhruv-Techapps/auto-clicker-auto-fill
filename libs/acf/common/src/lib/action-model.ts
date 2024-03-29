import { Addon } from './addon-model';
import { RANDOM_UUID } from './common';
import { RETRY_OPTIONS } from './setting-model';

// Action Condition
export enum ACTION_STATUS {
  '~~ Select STATUS ~~' = '',
  SKIPPED = 'skipped',
  DONE = 'done',
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
  actionIndex: number;
  status: ACTION_STATUS;
  operator?: ACTION_CONDITION_OPR;
};

export const getDefaultActionCondition = (operator?: ACTION_CONDITION_OPR): ActionCondition => ({
  id: crypto.randomUUID(),
  actionIndex: -1,
  status: ACTION_STATUS['~~ Select STATUS ~~'],
  operator,
});

// Action Statement

export type ActionStatement = {
  conditions: Array<ActionCondition>;
  then: ACTION_RUNNING;
  goto?: number;
};

export const getDefaultActionStatement = (operator?: ACTION_CONDITION_OPR): ActionStatement => ({
  conditions: [getDefaultActionCondition(operator)],
  then: ACTION_RUNNING.PROCEED,
});

// Action Setting
export type ActionSettings = {
  iframeFirst?: boolean;
  retry?: number;
  retryInterval?: number | string;
  retryOption?: RETRY_OPTIONS;
  retryGoto?: number;
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
  status?: string;
  error?: string[];
};

export const getDefaultAction = (): Action => ({
  id: crypto.randomUUID(),
  elementFinder: '',
  error: ['elementFinder'],
});
