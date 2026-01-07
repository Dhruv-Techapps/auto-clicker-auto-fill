import { Logger } from '@dhruv-techapps/core-open-telemetry/content-script';
import { Sandbox } from '@dhruv-techapps/shared-sandbox';
import CommonEvents from './common.events';

const CHANGE_EVENT = ['input', 'change'];

export const FuncEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    CommonEvents.checkNode(element, value, CHANGE_EVENT, 'FuncEvents');
  };

  const start = async (elements: Array<HTMLElement>, value: string) => {
    value = value.replace(/func::/i, '');
    Logger.debug('FuncEvents', {
      actionId: window.ext.__currentAction,
      actionName: window.ext.__currentActionName
    });
    value = await Sandbox.sandboxEval(value);

    CommonEvents.loopElements(elements, value, checkNode);
    return true;
  };
  return { start };
})();
