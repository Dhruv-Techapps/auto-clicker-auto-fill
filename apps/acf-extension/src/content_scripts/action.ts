import { ACTION_STATUS, Action } from '@dhruv-techapps/acf-common';
import { Events } from '@dhruv-techapps/acf-events';
import Common from './common';
import { statusBar } from './status-bar';

import { STATUS_BAR_TYPE } from '@dhruv-techapps/status-bar';
import { ACFValue } from './util/acf-util';

const ActionProcessor = (() => {
  const repeatFunc = async (action: Action, repeat?: number, repeatInterval?: number | string): Promise<ACTION_STATUS | number> => {
    if (repeat !== undefined) {
      if (repeat > 0 || repeat < -1) {
        await statusBar.wait(repeatInterval, STATUS_BAR_TYPE.ACTION_REPEAT, repeat);
        repeat -= 1;
        window.__actionRepeat = window.__actionRepeat + 1;
        const result = await process(action);
        if (typeof result === 'number' || result === ACTION_STATUS.SKIPPED) {
          return result;
        }
        return await repeatFunc(action, repeat, repeatInterval);
      }
    }
    return ACTION_STATUS.DONE;
  };

  const process = async (action: Action) => {
    const elementFinder = await ACFValue.getValue(action.elementFinder);
    const elements = await Common.start(elementFinder, action.settings);
    if (typeof elements === 'number') {
      return elements;
    }
    if (elements === undefined) {
      return ACTION_STATUS.SKIPPED;
    }
    const value = action.value ? await ACFValue.getValue(action.value) : action.value;
    await Events.check(elements, value);
  };

  const start = async (action: Action) => {
    window.__actionRepeat = 1;
    const result = await process(action);
    if (typeof result === 'number' || result === ACTION_STATUS.SKIPPED) {
      return result;
    }
    return await repeatFunc(action, action.repeat, action.repeatInterval);
  };

  return { start };
})();

export default ActionProcessor;
