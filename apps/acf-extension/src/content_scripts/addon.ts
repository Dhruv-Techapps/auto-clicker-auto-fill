import { EActionStatus, EAddonConditions, ERecheckOptions, IActionSettings, IAddon } from '@dhruv-techapps/acf-common';
import { ConfigError, generateUUID, SystemError } from '@dhruv-techapps/core-common';
import { OpenTelemetryService } from '@dhruv-techapps/core-open-telemetry/content-script';
import { Sandbox } from '@dhruv-techapps/shared-sandbox';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
import { RADIO_CHECKBOX_NODE_NAME } from '../common/constant';
import Common from './common';
import { I18N_COMMON, I18N_ERROR } from './i18n';
import { statusBar } from './status-bar';
import { ACFValue } from './util/acf-value';

const ADDON_I18N = {
  TITLE: chrome.i18n.getMessage('@ADDON__TITLE')
};

interface IAddonType extends IAddon {
  nodeValue: string | boolean;
}

const AddonProcessor = (() => {
  const recheckFunc = async ({ nodeValue, elementFinder, value, condition, recheck, recheckOption, ...props }: IAddonType, settings?: IActionSettings): Promise<void> => {
    if (recheck !== undefined) {
      if (recheck > 0 || recheck < -1) {
        recheck -= 1;
        await statusBar.wait(props.recheckInterval, STATUS_BAR_TYPE.ADDON_RECHECK, recheck + 1);
        return await start({ elementFinder, value, condition, recheck, recheckOption, ...props }, settings);
      }
    }
    window.ext.__actionError = `${ADDON_I18N.TITLE} ${I18N_COMMON.COMPARE} '${nodeValue}' ${condition} '${value}'. ${I18N_COMMON.RESULT}: ${I18N_COMMON.CONDITION_NOT_SATISFIED}`;
    if (recheckOption === ERecheckOptions.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload();
      } else {
        window.addEventListener('load', () => {
          window.location.reload();
        });
      }
    } else if (recheckOption === ERecheckOptions.STOP) {
      throw new ConfigError(`'${nodeValue}' ${condition} '${value}'`, I18N_ERROR.NO_MATCH);
    } else if (recheckOption === ERecheckOptions.GOTO && props.recheckGoto !== undefined) {
      throw props.recheckGoto;
    }
    throw EActionStatus.SKIPPED;
  };

  const extractValue = (element: HTMLElement, value: string, valueExtractor?: string, valueExtractorFlags?: string): string => {
    if (!valueExtractor) {
      return value;
    }
    if (/^@\w+(-\w+)?$/.test(valueExtractor)) {
      return element.getAttribute(valueExtractor.replace('@', '')) || value;
    }
    try {
      const regex = new RegExp(valueExtractor, valueExtractorFlags || '');
      const matches = value.match(regex);
      return matches?.join('') || value;
    } catch (error) {
      throw new ConfigError(`Invalid value extractor regex pattern: '${valueExtractor}'`, 'Invalid Regex Pattern');
    }
  };

  const getNodeValue = (elements: Array<HTMLElement>, valueExtractor?: string, valueExtractorFlags?: string): string | boolean => {
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
      value = element.textContent ?? element.innerText;
    } else {
      value = element.innerText;
    }
    if (typeof value === 'string') {
      value = extractValue(element, value, valueExtractor, valueExtractorFlags);
    }
    return value;
  };

  const safeRegExpTest = (pattern: string, testString: string): boolean => {
    try {
      const regex = new RegExp(pattern, 'gi');
      return regex.test(testString);
    } catch (error) {
      throw new ConfigError(`Invalid regular expression pattern: '${pattern}'`, 'Invalid Regex Pattern');
    }
  };

  const compare = (nodeValue: string | boolean, condition: EAddonConditions, value: string): boolean => {
    if (/than/gi.test(condition) && (Number.isNaN(Number(nodeValue)) || Number.isNaN(Number(value)))) {
      throw new ConfigError(`${I18N_ERROR.WRONG_DESCRIPTION}'${nodeValue}' '${value}'`, I18N_ERROR.WRONG_TITLE);
    }
    if (typeof nodeValue === 'boolean' || condition === EAddonConditions['✓ Is Checked '] || condition === EAddonConditions['✕ Is Not Checked ']) {
      if (typeof nodeValue === 'boolean') {
        if ((nodeValue && condition === EAddonConditions['✓ Is Checked ']) || (!nodeValue && condition === EAddonConditions['✕ Is Not Checked '])) {
          return true;
        }
        return false;
      } else {
        throw new ConfigError(I18N_ERROR.ELEMENT_FINDER_DESCRIPTION, I18N_ERROR.ELEMENT_FINDER_TITLE);
      }
    }

    switch (condition) {
      case EAddonConditions['= Equals']:
        return safeRegExpTest(`^${value}$`, nodeValue);
      case EAddonConditions['!= Not Equals']:
        return !safeRegExpTest(`^${value}$`, nodeValue);
      case EAddonConditions['~ Contains']:
        return safeRegExpTest(value, nodeValue);
      case EAddonConditions['!~ Not Contains']:
        return !safeRegExpTest(value, nodeValue);
      case EAddonConditions['> Greater Than']:
        return Number(nodeValue) > Number(value);
      case EAddonConditions['>= Greater Than Equals']:
        return Number(nodeValue) >= Number(value);
      case EAddonConditions['< Less Than']:
        return Number(nodeValue) < Number(value);
      case EAddonConditions['<= Less Than Equals']:
        return Number(nodeValue) <= Number(value);
      default:
        throw new SystemError('Addon Condition not found', `${condition} condition not found`);
    }
  };

  const start = async ({ elementFinder, value, condition, valueExtractor, valueExtractorFlags, ...props }: IAddon, settings?: IActionSettings): Promise<void> => {
    let nodeValue;
    if (/^Func::/gi.test(elementFinder)) {
      nodeValue = await Sandbox.sandboxEval(elementFinder.replace(/^Func::/gi, ''));
    } else {
      elementFinder = await ACFValue.getValue(elementFinder);
      const elements = await Common.start(elementFinder, settings);
      if (elements) {
        nodeValue = getNodeValue(elements, valueExtractor, valueExtractorFlags);
      }
    }
    if (nodeValue !== undefined) {
      const result: boolean = compare(nodeValue, condition, value);
      if (!result) {
        await recheckFunc({ nodeValue, elementFinder, value, condition, valueExtractor, valueExtractorFlags, ...props }, settings);
      }
      console.debug(
        `${ADDON_I18N.TITLE} #${window.ext.__currentAction} [${window.ext.__currentActionName}]`,
        `${I18N_COMMON.COMPARE} '${nodeValue}' ${condition} '${value}'. ${I18N_COMMON.RESULT}: ${I18N_COMMON.CONDITION_SATISFIED}`
      );
    }
  };
  const check = async (addon?: IAddon, actionSettings?: IActionSettings) => {
    if (addon) {
      let { value } = addon;
      const { elementFinder, condition, ...props } = addon;
      if (elementFinder && value && condition) {
        const key = generateUUID();
        try {
          OpenTelemetryService.startSpan(key, `Addon #${window.ext.__currentAction}`, {
            headers: window.ext.__actionHeaders,
            attributes: { condition, elementFinder, value }
          });
          value = await ACFValue.getValue(value);
          return await start({ ...props, elementFinder, value, condition }, actionSettings);
        } finally {
          OpenTelemetryService.endSpan(key);
        }
      }
    }
    return true;
  };

  return { check };
})();

export default AddonProcessor;
