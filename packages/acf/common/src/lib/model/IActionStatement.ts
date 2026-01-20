import { generateUUID, TRandomUUID } from '@dhruv-techapps/core-common';
import { EErrorOptions, TGoto } from './ICommon';

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
  /**
   * @deprecated Use `option` instead. This field will be removed in a future version.
   */
  then?: EErrorOptions;
  option: EErrorOptions;
  goto?: TGoto;
}

export const getDefaultActionStatement = (actionId: TRandomUUID, operator?: EActionConditionOperator): IActionStatement => ({
  conditions: [getDefaultActionCondition(actionId, operator)],
  option: EErrorOptions.STOP
});
