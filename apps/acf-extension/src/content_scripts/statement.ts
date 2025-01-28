import { Action, ACTION_CONDITION_OPR, ACTION_RUNNING, ActionCondition, ActionStatement, GOTO, RETRY_OPTIONS } from '@dhruv-techapps/acf-common';
import { ConfigError } from '@dhruv-techapps/core-common';
import { I18N_COMMON, I18N_ERROR } from './i18n';

const Statement = (() => {
  const conditionResult = (conditions: Array<ActionCondition>, actions: Array<Action>) => {
    return conditions
      .map(({ actionId, actionIndex, status, operator }) => ({
        status: actionIndex === undefined ? actions.find((action) => action.id === actionId)?.status === status : actions[actionIndex].status === status,
        operator,
      }))
      .reduce((accumulator, currentValue) => {
        if (currentValue.operator === undefined) {
          return currentValue.status;
        }
        return currentValue.operator === ACTION_CONDITION_OPR.AND ? accumulator && currentValue.status : accumulator || currentValue.status;
      }, false);
  };

  const checkThen = (condition: boolean, then: RETRY_OPTIONS, goto?: GOTO) => {
    window.__actionError = `↔️ ${chrome.i18n.getMessage('@ACTION__TITLE')} ${condition ? I18N_COMMON.CONDITION_SATISFIED : I18N_COMMON.CONDITION_NOT_SATISFIED}`;
    if (!condition) {
      if (then === RETRY_OPTIONS.GOTO && goto) {
        throw goto;
      } else if (then === RETRY_OPTIONS.RELOAD) {
        if (document.readyState === 'complete') {
          window.location.reload();
        } else {
          window.addEventListener('load', () => {
            window.location.reload();
          });
        }
      } else if (then === RETRY_OPTIONS.STOP) {
        throw new ConfigError(`Action Condition`, I18N_ERROR.NO_MATCH);
      }
      throw ACTION_RUNNING.SKIP;
    }
  };

  const check = (actions: Array<Action>, statement?: ActionStatement) => {
    if (statement) {
      const { conditions, then, goto } = statement;
      if (conditions && then) {
        checkThen(conditionResult(conditions, actions), then, goto);
      }
    }
  };

  return { check };
})();

export default Statement;
