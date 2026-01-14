import { EActionStatus, IAction, TActionResult } from '@dhruv-techapps/acf-common';
import { OpenTelemetryService } from '@dhruv-techapps/core-open-telemetry/content-script';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
import Common from './common';
import { statusBar } from './status-bar';
import { ACFEvents } from './util/acf-events';
import { ACFValue } from './util/acf-value';

const ActionProcessor = (() => {
  const repeatFunc = async (action: IAction, repeat?: number, repeatInterval?: number | string): Promise<EActionStatus.DONE | TActionResult> => {
    if (repeat !== undefined) {
      if (repeat > 0 || repeat < -1) {
        await statusBar.wait(repeatInterval, STATUS_BAR_TYPE.ACTION_REPEAT, repeat);
        repeat -= 1;
        window.ext.__actionRepeat = window.ext.__actionRepeat + 1;
        OpenTelemetryService.addEvent(window.ext.__actionKey, `Action Repeat - ${window.ext.__actionRepeat}`);
        const result = await process(action);
        if (result) {
          return result;
        }
        return await repeatFunc(action, repeat, repeatInterval);
      }
    }
    return EActionStatus.DONE;
  };

  const process = async (action: IAction): Promise<TActionResult | void> => {
    const elementFinder = await ACFValue.getValue(action.elementFinder);
    const elements = await Common.start(elementFinder, action.settings);
    if (elements === undefined || elements.length === 0) {
      return { status: EActionStatus.SKIPPED };
    }
    const value = action.value ? await ACFValue.getValue(action.value, action.settings) : action.value;
    await ACFEvents.check(elementFinder, elements, value);
  };

  const start = async (action: IAction): Promise<EActionStatus.DONE | TActionResult> => {
    window.ext.__actionRepeat = 1;
    const result = await process(action);
    if (result) {
      return result;
    }
    return await repeatFunc(action, action.repeat, action.repeatInterval);
  };

  return { start };
})();

export default ActionProcessor;
