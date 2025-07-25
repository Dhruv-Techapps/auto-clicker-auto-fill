import { EActionConditionOperator, EActionRunning, ERetryOptions, IAction, IActionCondition, IActionStatement, TGoto } from '@dhruv-techapps/acf-common';
import { ConfigError } from '@dhruv-techapps/core-common';
import { I18N_COMMON, I18N_ERROR } from './i18n';

const ACTION_CONDITION_I18N = {
  TITLE: chrome.i18n.getMessage('@ACTION_CONDITION__TITLE')
};

const Statement = (() => {
  const conditionResult = (conditions: Array<IActionCondition>, actions: Array<IAction>) => {
    if (conditions.filter((condition) => condition.actionIndex !== undefined && condition.actionId === undefined).length > 0) {
      throw new ConfigError(I18N_ERROR.ACTION_CONDITION_CONFIG_ERROR, ACTION_CONDITION_I18N.TITLE);
    }
    return conditions
      .map(({ actionId, status, operator }) => ({
        status: actions.find((action) => action.id === actionId)?.status === status,
        operator
      }))
      .reduce((accumulator, currentValue) => {
        if (currentValue.operator === undefined) {
          return currentValue.status;
        }
        return currentValue.operator === EActionConditionOperator.AND ? accumulator && currentValue.status : accumulator || currentValue.status;
      }, false);
  };

  const checkThen = (condition: boolean, then: ERetryOptions, goto?: TGoto) => {
    window.__actionError = `↔️ ${ACTION_CONDITION_I18N.TITLE} ${condition ? I18N_COMMON.CONDITION_SATISFIED : I18N_COMMON.CONDITION_NOT_SATISFIED}`;
    if (!condition) {
      if (then === ERetryOptions.GOTO && goto) {
        throw goto;
      } else if (then === ERetryOptions.RELOAD) {
        if (document.readyState === 'complete') {
          window.location.reload();
        } else {
          window.addEventListener('load', () => {
            window.location.reload();
          });
        }
      } else if (then === ERetryOptions.STOP) {
        throw new ConfigError(I18N_ERROR.NO_MATCH, ACTION_CONDITION_I18N.TITLE);
      }
      throw EActionRunning.SKIP;
    }
  };

  const check = (actions: Array<IAction>, statement?: IActionStatement) => {
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
