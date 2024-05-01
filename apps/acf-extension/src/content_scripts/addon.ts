import { ADDON_CONDITIONS, ActionSettings, Addon, RECHECK_OPTIONS, ValueExtractorFlags } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/acf-service';
import { ConfigError, Logger, SystemError } from '@dhruv-techapps/core-common';
import { Sandbox } from '@dhruv-techapps/sandbox';
import { wait } from '@dhruv-techapps/shared-util';
import { StatusBar } from '@dhruv-techapps/status-bar';
import { RADIO_CHECKBOX_NODE_NAME } from '../common/constant';
import Common from './common';
import Value from '../../../../libs/acf/acf-util/src/lib/value';

const LOGGER_LETTER = 'Addon';

type AddonType = { nodeValue: string | boolean } & Addon;

const AddonProcessor = (() => {
  const recheckFunc = async ({ nodeValue, elementFinder, value, condition, recheck, recheckOption, ...props }: AddonType, settings?: ActionSettings): Promise<number | boolean> => {
    if (recheck !== undefined) {
      if (recheck > 0 || recheck < -1) {
        recheck -= 1;
        await wait(props.recheckInterval, `${LOGGER_LETTER} recheck`, recheck + 1, '<interval>');
        // eslint-disable-next-line no-use-before-define
        return await start({ elementFinder, value, condition, recheck, recheckOption, ...props }, settings);
      }
    }
    // eslint-disable-next-line no-console
    console.table([{ elementFinder, value, condition, nodeValue }]);
    if (recheckOption === RECHECK_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload();
      } else {
        window.addEventListener('load', () => {
          window.location.reload();
        });
      }
    } else if (recheckOption === RECHECK_OPTIONS.STOP) {
      throw new ConfigError(`'${nodeValue}' ${condition} '${value}'`, "Addon didn't matched");
    } else if (recheckOption === RECHECK_OPTIONS.GOTO && props.recheckGoto !== undefined) {
      return props.recheckGoto;
    }
    Logger.colorInfo('RecheckOption', recheckOption);
    return false;
  };

  const extractValue = (element: HTMLElement, value: string, valueExtractor?: string, valueExtractorFlags?: ValueExtractorFlags): string => {
    if (!valueExtractor) {
      return value;
    }
    if (/^@\w+(-\w+)?$/.test(valueExtractor)) {
      return element.getAttribute(valueExtractor.replace('@', '')) || value;
    }
    const matches = value.match(RegExp(valueExtractor, valueExtractorFlags || ''));
    return matches?.join('') || value;
  };

  const getNodeValue = (elements: Array<HTMLElement>, valueExtractor?: string, valueExtractorFlags?: ValueExtractorFlags): string | boolean => {
    const element = elements[0];
    let value: string | boolean;
    if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      value = element.value;
    } else if (element instanceof HTMLInputElement) {
      if (RADIO_CHECKBOX_NODE_NAME.test(element.type)) {
        value = element.checked;
      } else {
        value = element.value;
      }
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: 'Addon' });
      value = element.textContent || element.innerText;
    } else {
      value = element.innerText;
    }
    if (typeof value === 'string') {
      value = extractValue(element, value, valueExtractor, valueExtractorFlags);
    }
    return value;
  };

  const compare = (nodeValue: string | boolean, condition: ADDON_CONDITIONS, value: string) => {
    Logger.colorDebug('Compare', nodeValue, condition, value);
    if (/than/gi.test(condition) && (Number.isNaN(Number(nodeValue)) || Number.isNaN(Number(value)))) {
      throw new ConfigError(`Greater || Less can only compare number '${nodeValue}' '${value}'`, 'Wrong Comparison');
    }
    if (typeof nodeValue === 'boolean' || condition === ADDON_CONDITIONS['✓ Is Checked '] || condition === ADDON_CONDITIONS['✕ Is Not Checked ']) {
      if (typeof nodeValue === 'boolean') {
        if ((nodeValue && condition === ADDON_CONDITIONS['✓ Is Checked ']) || (!nodeValue && condition === ADDON_CONDITIONS['✕ Is Not Checked '])) {
          return true;
        }
        return false;
      } else {
        throw new ConfigError('Element Finder need to point checkbox', 'Wrong Element Finder / Addon Condition');
      }
    }

    switch (condition) {
      case ADDON_CONDITIONS['= Equals']:
        return new RegExp(`^${value}$`, 'gi').test(nodeValue);
      case ADDON_CONDITIONS['!= Not Equals']:
        return !new RegExp(`^${value}$`, 'gi').test(nodeValue);
      case ADDON_CONDITIONS['~ Contains']:
        return new RegExp(`${value}`, 'gi').test(nodeValue);
      case ADDON_CONDITIONS['!~ Not Contains']:
        return !new RegExp(`${value}`, 'gi').test(nodeValue);
      case ADDON_CONDITIONS['> Greater Than']:
        return Number(nodeValue) > Number(value);
      case ADDON_CONDITIONS['>= Greater Than Equals']:
        return Number(nodeValue) >= Number(value);
      case ADDON_CONDITIONS['< Less Than']:
        return Number(nodeValue) < Number(value);
      case ADDON_CONDITIONS['<= Less Than Equals']:
        return Number(nodeValue) <= Number(value);
      default:
        throw new SystemError('Addon Condition not found', `${condition} condition not found`);
    }
  };

  const start = async ({ elementFinder, value, condition, valueExtractor, valueExtractorFlags, ...props }: Addon, settings?: ActionSettings) => {
    try {
      StatusBar.getInstance().addonUpdate();
      let nodeValue;
      if (/^Func::/gi.test(elementFinder)) {
        nodeValue = await Sandbox.sandboxEval(elementFinder.replace(/^Func::/gi, ''));
      } else {
        elementFinder = await Value.getValue(elementFinder);
        const elements = await Common.start(elementFinder, settings);
        if (typeof elements === 'number') {
          return elements;
        }
        if (elements) {
          nodeValue = getNodeValue(elements, valueExtractor, valueExtractorFlags);
        }
      }
      if (nodeValue !== undefined) {
        let result: boolean | number = compare(nodeValue, condition, value);
        if (!result) {
          result = await recheckFunc({ nodeValue, elementFinder, value, condition, valueExtractor, valueExtractorFlags, ...props }, settings);
        }
        Logger.colorDebug('Compare Result', result);
        console.groupEnd();
        return result;
      }
      console.groupEnd();
      return false;
    } catch (error) {
      console.groupEnd();
      throw error;
    }
  };
  const check = async (addon?: Addon, actionSettings?: ActionSettings) => {
    if (addon) {
      let { value } = addon;
      const { elementFinder, condition, ...props } = addon;
      if (elementFinder && value && condition) {
        console.groupCollapsed(LOGGER_LETTER);

        value = await Value.getValue(value);
        return await start({ ...props, elementFinder, value, condition }, actionSettings);
      }
    }
    return true;
  };

  return { check };
})();

export default AddonProcessor;
