import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { ConfigError } from '@dhruv-techapps/core-common';
import { Logger } from '@dhruv-techapps/core-open-telemetry/content-script';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';

const CHANGE_EVENT = ['input', 'change'];

export const PrependEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    const eW = CommonEvents.getElementWindow(element);
    if (element instanceof eW.HTMLSelectElement || element instanceof eW.HTMLTextAreaElement || (element instanceof eW.HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value + element.value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent('isContentEditable', {
        event: 'PrependEvents',
        source: 'content_script'
      });
      element.textContent = value + element.textContent;
    } else {
      throw new ConfigError(UNKNOWN_ELEMENT_TYPE_ERROR, 'PrependEvents');
    }
    CHANGE_EVENT.forEach((event) => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
    });
    element.focus();
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    value = value.replace(/^prepend::/i, '');
    Logger.debug('PrependEvents', {
      actionId: window.ext.__currentAction,
      actionName: window.ext.__currentActionName
    });
    CommonEvents.loopElements(elements, value, checkNode);
  };

  return { start };
})();
