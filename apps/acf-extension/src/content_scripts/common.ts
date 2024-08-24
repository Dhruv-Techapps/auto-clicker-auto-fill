import { ActionSettings, RETRY_OPTIONS } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { ConfigError, Logger } from '@dhruv-techapps/core-common';
import { I18N_ERROR } from '../content_scripts/i18n';
import { statusBar } from '../content_scripts/status-bar';

const Common = (() => {
  const retryFunc = async (retry?: number, retryInterval?: number | string) => {
    if (retry !== undefined) {
      if (retry > 0 || retry < -1) {
        await statusBar.wait(retryInterval, undefined, retry);
        return true;
      }
    }
    return false;
  };

  const getElements = async (document: Document, elementFinder: string, retry: number, retryInterval: number | string): Promise<Array<HTMLElement> | undefined> => {
    let elements: HTMLElement[] | undefined;
    try {
      if (/^(id::|#)/gi.test(elementFinder)) {
        const element = document.getElementById(elementFinder.replace(/^(id::|#)/gi, ''));
        elements = element ? [element] : undefined;
      } else if (/^Selector::/gi.test(elementFinder)) {
        const element = document.querySelector<HTMLElement>(elementFinder.replace(/^Selector::/gi, ''));
        elements = element ? [element] : undefined;
      } else if (/^ClassName::/gi.test(elementFinder)) {
        const classElements = document.getElementsByClassName(elementFinder.replace(/^ClassName::/gi, '')) as HTMLCollectionOf<HTMLElement>;
        elements = classElements.length !== 0 ? Array.from(classElements) : undefined;
      } else if (/^Name::/gi.test(elementFinder)) {
        const nameElements = document.getElementsByName(elementFinder.replace(/^Name::/gi, ''));
        elements = nameElements.length !== 0 ? Array.from(nameElements) : undefined;
      } else if (/^TagName::/gi.test(elementFinder)) {
        const tagElements = document.getElementsByTagName(elementFinder.replace(/^TagName::/gi, '')) as HTMLCollectionOf<HTMLElement>;
        elements = tagElements.length !== 0 ? Array.from(tagElements) : undefined;
      } else if (/^SelectorAll::/gi.test(elementFinder)) {
        const querySelectAll = document.querySelectorAll<HTMLElement>(elementFinder.replace(/^SelectorAll::/gi, ''));
        elements = querySelectAll.length !== 0 ? Array.from(querySelectAll) : undefined;
      } else {
        const nodes = document.evaluate(elementFinder, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (nodes.snapshotLength !== 0) {
          elements = [];
          let i = 0;
          while (i < nodes.snapshotLength) {
            elements.push(nodes.snapshotItem(i) as HTMLElement);
            i += 1;
          }
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new ConfigError(e.message, I18N_ERROR.INVALID_ELEMENT_FINDER);
      }
      throw new ConfigError(JSON.stringify(e), I18N_ERROR.INVALID_ELEMENT_FINDER);
    }

    if (!elements) {
      const doRetry = await retryFunc(retry, retryInterval);
      if (doRetry) {
        elements = await getElements(document, elementFinder, retry - 1, retryInterval);
      }
    }
    return elements;
  };

  const main = async (elementFinder: string, retry: number, retryInterval: number | string) => await getElements(document, elementFinder, retry, retryInterval);

  const checkIframe = async (elementFinder: string, retry: number, retryInterval: number | string) => {
    const iFrames = document.getElementsByTagName('iframe');
    let elements;
    for (let index = 0; index < iFrames.length; index += 1) {
      if (!iFrames[index].src || iFrames[index].src === 'about:blank') {
        const { contentDocument } = iFrames[index];
        if (contentDocument) {
          elements = await getElements(contentDocument, elementFinder, retry, retryInterval);
          if (elements) {
            break;
          }
        }
      }
    }
    return elements;
  };

  const checkRetryOption = (retryOption: RETRY_OPTIONS, elementFinder: string, retryGoto?: number) => {
    if (retryOption === RETRY_OPTIONS.RELOAD) {
      if (document.readyState === 'complete') {
        window.location.reload();
      } else {
        window.addEventListener('load', window.location.reload);
      }
      throw new ConfigError(`elementFinder: ${elementFinder}`, I18N_ERROR.NOT_FOUND_RELOAD);
    } else if (retryOption === RETRY_OPTIONS.STOP) {
      throw new ConfigError(`elementFinder: ${elementFinder}`, I18N_ERROR.NOT_FOUND_STOP);
    } else if (retryOption === RETRY_OPTIONS.GOTO) {
      console.groupEnd();
      return retryGoto;
    }
    Logger.colorInfo('RetryOption', retryOption);
  };

  const start = async (elementFinder: string, settings?: ActionSettings) => {
    if (!elementFinder) {
      throw new ConfigError(I18N_ERROR.ELEMENT_FINDER_BLANK, 'Element Finder');
    }

    const { retryOption, retryInterval, retry, checkiFrames, iframeFirst, retryGoto } = { ...(await new SettingsStorage().getSettings()), ...settings };
    let elements: HTMLElement[] | undefined;
    if (iframeFirst) {
      elements = await checkIframe(elementFinder, retry, retryInterval);
    } else {
      elements = await main(elementFinder, retry, retryInterval);
    }
    if (!elements || elements.length === 0) {
      if (iframeFirst) {
        elements = await main(elementFinder, retry, retryInterval);
      } else if (checkiFrames) {
        elements = await checkIframe(elementFinder, retry, retryInterval);
      }
    }
    if (!elements || elements.length === 0) {
      return checkRetryOption(retryOption, elementFinder, retryGoto);
    }
    return elements;
  };

  const getNotificationIcon = () => chrome.runtime.getManifest().action.default_icon;

  return { start, getElements, getNotificationIcon };
})();

export default Common;
