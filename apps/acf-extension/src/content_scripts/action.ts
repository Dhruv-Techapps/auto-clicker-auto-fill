import { EActionStatus, IAction } from '@dhruv-techapps/acf-common';
import { OpenTelemetryService } from '@dhruv-techapps/core-open-telemetry/content-script';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
import Common from './common';
import { statusBar } from './status-bar';
import { ACFEvents } from './util/acf-events';
import { ACFValue } from './util/acf-value';

const ActionProcessor = (() => {
  const repeatFunc = async (action: IAction, repeat?: number, repeatInterval?: number | string): Promise<EActionStatus.DONE> => {
    if (repeat !== undefined) {
      if (repeat > 0 || repeat < -1) {
        await statusBar.wait(repeatInterval, STATUS_BAR_TYPE.ACTION_REPEAT, repeat);
        repeat -= 1;
        window.ext.__actionRepeat = window.ext.__actionRepeat + 1;
        OpenTelemetryService.addEvent(window.ext.__actionKey, `Action Repeat - ${window.ext.__actionRepeat}`);
        await process(action);
        return await repeatFunc(action, repeat, repeatInterval);
      }
    }
    return EActionStatus.DONE;
  };

  const process = async (action: IAction) => {
    const elementFinder = await ACFValue.getValue(action.elementFinder);
    OpenTelemetryService.addEvent(window.ext.__actionKey, `Element Finder - ${elementFinder}`);
    const elements = await Common.start(elementFinder, action.settings);
    if (elements === undefined || elements.length === 0) {
      throw EActionStatus.SKIPPED;
    }
    const value = action.value ? await ACFValue.getValue(action.value, action.settings) : action.value;
    await ACFEvents.check(elementFinder, elements, value);
  };

  const start = async (action: IAction) => {
    window.ext.__actionRepeat = 1;
    await process(action);
    return await repeatFunc(action, action.repeat, action.repeatInterval);
  };

  return { start };
})();

export default ActionProcessor;
