import { Logger } from '@dhruv-techapps/core-open-telemetry/content-script';
import CommonEvents from './common.events';

export const ElementEvents = (() => {
  const execCommand = (element: HTMLElement, value: string) => {
    const [, action, prop] = value.split('::');
    if (action === 'scrollIntoView') {
      if (!prop) {
        element.scrollIntoView();
      } else if (typeof prop === 'boolean') {
        element.scrollIntoView(prop);
      } else {
        try {
          const options = JSON.parse(prop);
          element.scrollIntoView(options);
        } catch (e) {
          Logger.error(`Invalid scrollIntoView options`, {
            actionId: window.ext.__currentAction,
            actionName: window.ext.__currentActionName,
            'error.message': (e as Error).message,
            'error.stack': (e as Error).stack
          });
        }
      }
    } else if (action === 'remove') {
      element.remove();
    }
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    Logger.debug('ElementEvents', {
      actionId: window.ext.__currentAction,
      actionName: window.ext.__currentActionName
    });
    CommonEvents.loopElements(elements, value, execCommand);
  };
  return { start };
})();
