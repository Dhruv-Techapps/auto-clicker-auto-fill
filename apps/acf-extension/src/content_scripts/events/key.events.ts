import { Logger } from '@dhruv-techapps/core-common';
import { ConfigError, SystemError } from '../error';
import { wait } from '../util';
import CommonEvents from './common.events';

// KeyEvents::{value:'Example text',delay:300}
// KeyEvents::Example text

const KEYBOARD_EVENT_KEYDOWN = 'keydown';
const KEYBOARD_EVENT_KEYUP = 'keyup';

type KeyEvent = KeyboardEventInit & {
  value?: string;
  delay?: number;
};

export const KeyEvents = (() => {
  const getVerifiedEvents = (events: string): Array<KeyEvent> => {
    Logger.colorDebug(`getVerifiedEvents`, events);
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined');
    }
    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1];
    let result: Array<KeyEvent>;
    try {
      const { value, delay = 0, shiftKey, ctrlKey, metaKey, altKey }: KeyEvent = JSON.parse(events);
      if (value) {
        result = value.split('').map<KeyEvent>((event: string) => ({ ...CommonEvents.getKeyboardEventProperties({ key: event, shiftKey, ctrlKey, metaKey, altKey }), delay }));
      } else {
        throw new ConfigError(events, 'Invalid Events');
      }
    } catch (error) {
      if (error instanceof Error) {
        Logger.colorError(error.message);
      } else {
        Logger.colorError(JSON.stringify(error));
      }
      result = events.split('').map((event) => ({ ...CommonEvents.getKeyboardEventProperties({ key: event }) }));
    }
    if (result) {
      return result;
    }
    throw new ConfigError(events, 'Invalid Events');
  };

  const dispatchEvent = async (element: HTMLElement, events: Array<KeyEvent>) => {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      // eslint-disable-next-line no-restricted-syntax
      for (const event of events) {
        element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYDOWN, { ...CommonEvents.getKeyboardEventProperties(event) }));
        element.value += event.key;
        element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYUP, { ...CommonEvents.getKeyboardEventProperties(event) }));
        if (event.delay) {
          await wait(event.delay, 'Key Event');
        }
      }
    }
  };

  const start = (elements: Array<HTMLElement>, event: string) => {
    const events = getVerifiedEvents(event);
    Logger.colorDebug(`KeyEvents`, events);
    CommonEvents.loopElements<HTMLElement, Array<KeyEvent>>(elements, events, dispatchEvent);
  };
  return { start };
})();
