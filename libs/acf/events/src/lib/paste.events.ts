import { ConfigError } from '@dhruv-techapps/core-common';
import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { Sandbox } from '@dhruv-techapps/sandbox';

const LOCAL_STORAGE_COPY = 'auto-clicker-copy';
const CHANGE_EVENT = ['input', 'change'];

export const PasteEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: 'PasteEvents' });
      element.textContent = value;
    } else {
      throw new ConfigError(UNKNOWN_ELEMENT_TYPE_ERROR, 'PasteEvents');
    }
    CHANGE_EVENT.forEach((event) => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
    });
    element.focus();
  };

  const start = async (elements: Array<HTMLElement>, value: string) => {
    const copyContent = localStorage.getItem(LOCAL_STORAGE_COPY);
    value = value.replace(/paste::/i, '');
    value = await Sandbox.sandboxEval(value, copyContent);
    console.debug(`Action #${window.__currentAction}`, elements, copyContent, value);
    CommonEvents.loopElements(elements, value, checkNode);
    return true;
  };

  return { start };
})();
