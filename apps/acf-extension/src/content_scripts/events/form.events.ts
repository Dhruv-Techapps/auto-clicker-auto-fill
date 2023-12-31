import { Logger } from '@dhruv-techapps/core-common';
import { ConfigError, SystemError } from '../error';
import CommonEvents from './common.events';

const FORM_EVENTS = ['blur', 'click', 'focus', 'select', 'submit', 'remove', 'clear', 'reset', 'search'];

export const FormEvents = (() => {
  const dispatchEvent = (element: HTMLElement, events: Array<string | Event>) => {
    if (!(element instanceof HTMLElement)) {
      throw new ConfigError(`elementFinder: ${element}`, 'Not HTMLElement');
    }
    events.forEach((event) => {
      switch (typeof event === 'string' ? event : event.type) {
        case 'blur':
          element.blur();
          break;
        case 'click':
          element.click();
          break;
        case 'focus':
          element.focus();
          break;
        case 'submit':
          if (element instanceof HTMLFormElement) {
            element.submit();
          } else if (
            element instanceof HTMLSelectElement ||
            element instanceof HTMLTextAreaElement ||
            element instanceof HTMLInputElement ||
            element instanceof HTMLButtonElement ||
            element instanceof HTMLLabelElement ||
            element instanceof HTMLOptionElement ||
            element instanceof HTMLFieldSetElement ||
            element instanceof HTMLOutputElement
          ) {
            element.form?.submit();
          } else {
            throw new ConfigError(`elementFinder: ${element}`, 'Invalid Element for submit');
          }
          break;
        case 'select':
          if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
            element.select();
          }
          break;
        case 'remove':
          element.remove();
          break;
        case 'clear':
          if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
            element.value = '';
          } else {
            throw new ConfigError(`elementFinder: ${element}`, 'Invalid Element for clear');
          }
          break;
        default:
          throw new SystemError(`Unhandled Event  "${event}"`, 'Form Events');
      }
    });
  };

  const start = (elements: Array<HTMLElement>, action: string) => {
    const events = CommonEvents.getVerifiedEvents(FORM_EVENTS, action);
    Logger.colorDebug(`FormEvents`, events);
    CommonEvents.loopElements(elements, events, dispatchEvent);
  };
  return { start };
})();
