import { Logger } from '@dhruv-techapps/core-open-telemetry/content-script';
import { Sandbox } from '@dhruv-techapps/shared-sandbox';
import CommonEvents from './common.events';

const LOCAL_STORAGE_COPY = 'auto-clicker-copy';
const CHANGE_EVENT = ['input', 'change'];

export const PasteEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    CommonEvents.checkNode(element, value, CHANGE_EVENT, 'PasteEvents');
  };

  const start = async (elements: Array<HTMLElement>, value: string) => {
    const copyContent = localStorage.getItem(LOCAL_STORAGE_COPY);
    value = value.replace(/paste::/i, '');
    value = await Sandbox.sandboxEval(value, copyContent);
    Logger.debug('PasteEvents', {
      actionId: window.ext.__currentAction,
      actionName: window.ext.__currentActionName
    });
    CommonEvents.loopElements(elements, value, checkNode);
    return true;
  };

  return { start };
})();
