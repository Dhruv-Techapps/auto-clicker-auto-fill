import { Sandbox } from '@dhruv-techapps/shared-sandbox';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

const CHANGE_EVENT = ['input', 'change'];

export const FuncEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    CommonEvents.checkNode(element, value, CHANGE_EVENT, 'FuncEvents');
  };

  const start = async (elements: Array<HTMLElement>, value: string) => {
    value = value.replace(/func::/i, '');
    console.debug(`${ACTION_I18N_TITLE} #${window.ext.__currentAction} [${window.ext.__currentActionName}]`, elements, value);
    value = await Sandbox.sandboxEval(value);

    CommonEvents.loopElements(elements, value, checkNode);
    return true;
  };
  return { start };
})();
