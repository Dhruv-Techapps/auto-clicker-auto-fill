import { EActionConditionOperator, EActionRunning, EActionStatus, ERetryOptions, IAction, IActionCondition, IActionStatement, IUserScript, TActionResult, TGoto } from '@dhruv-techapps/acf-common';
import { ConfigError, generateUUID } from '@dhruv-techapps/core-common';
import { OpenTelemetryService } from '@dhruv-techapps/core-open-telemetry/content-script';
import { I18N_COMMON, I18N_ERROR } from './i18n';

const ACTION_CONDITION_I18N = {
  TITLE: chrome.i18n.getMessage('@ACTION_CONDITION__TITLE')
};

const Statement = (() => {
  const conditionResult = (conditions: Array<IActionCondition>, actions: Array<IAction | IUserScript>) => {
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

  const checkThen = (condition: boolean, then: ERetryOptions, goto?: TGoto): TActionResult | null => {
    window.ext.__actionError = `↔️ ${ACTION_CONDITION_I18N.TITLE} ${condition ? I18N_COMMON.CONDITION_SATISFIED : I18N_COMMON.CONDITION_NOT_SATISFIED}`;
    if (!condition) {
      if (then === ERetryOptions.GOTO && goto) {
        return { status: EActionRunning.GOTO, goto };
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
      return { status: EActionStatus.SKIPPED };
    }
    return null;
  };

  const check = (actions: Array<IAction | IUserScript>, statement?: IActionStatement): TActionResult | null => {
    if (statement) {
      const { conditions, then, goto } = statement;
      if (conditions && then) {
        const key = generateUUID();
        try {
          OpenTelemetryService.startSpan(key, `Statement #${window.ext.__currentAction}`, {
            headers: window.ext.__actionHeaders,
            attributes: { then, goto: goto || 'none', conditions: conditions.length }
          });
          checkThen(conditionResult(conditions, actions), then, goto);
        } finally {
          OpenTelemetryService.endSpan(key);
        }
      }
    }
    return null;
  };

  return { check };
})();

export default Statement;
