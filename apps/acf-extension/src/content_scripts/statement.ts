import { ACTION_CONDITION_OPR, ACTION_RUNNING, ActionCondition, ActionStatement } from '@dhruv-techapps/acf-common';

const Statement = (() => {
  const conditionResult = (conditions: Array<ActionCondition>, actions: Array<string>) => {
    console.debug('Condition Result', { conditions, actions });
    return conditions
      .map(({ actionIndex, status, operator }) => ({ status: actions[actionIndex] === status, operator }))
      .reduce((accumulator, currentValue) => {
        if (currentValue.operator === undefined) {
          return currentValue.status;
        }
        return currentValue.operator === ACTION_CONDITION_OPR.AND ? accumulator && currentValue.status : accumulator || currentValue.status;
      }, false);
  };

  const checkThen = (condition: boolean | { status: boolean; operator: ACTION_CONDITION_OPR }, then: ACTION_RUNNING, goto?: number) => {
    console.debug('Check Then', { condition, then, goto });
    let result;
    if (condition) {
      if (then === ACTION_RUNNING.GOTO) {
        result = goto;
      } else {
        result = then === ACTION_RUNNING.PROCEED;
      }
    } else {
      result = then !== ACTION_RUNNING.PROCEED;
    }
    return result;
  };

  const check = async (actions: Array<string>, statement?: ActionStatement) => {
    if (statement) {
      const { conditions, then, goto } = statement;
      if (conditions && then) {
        const result = checkThen(conditionResult(conditions, actions), then, goto);
        console.debug('Statement Result', result);
        return result;
      }
    }

    return true;
  };

  return { check };
})();

export default Statement;
