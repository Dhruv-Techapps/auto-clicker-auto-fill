import { ELoadTypes, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { ConfigStorage, GetConfigResult, SettingsStorage } from '@dhruv-techapps/acf-store';
import { IExtension, Logger, LoggerColor } from '@dhruv-techapps/core-common';
import { scope } from '../common/instrument';
import ConfigProcessor from './config';
import { statusBar } from './status-bar';

scope.setTag('page', 'content-script');

declare global {
  interface Window {
    ext: IExtension;
  }
}

window.ext = window.ext || {};

let reloadOnError = false;
SettingsStorage.getSettings().then((settings) => {
  if (settings.reloadOnError !== undefined) {
    reloadOnError = settings.reloadOnError;
  }
});

async function loadConfig(loadType: ELoadTypes) {
  try {
    new ConfigStorage().getConfig().then(async ({ autoConfig, manualConfigs }: GetConfigResult) => {
      if (autoConfig) {
        if (autoConfig.loadType === loadType || (autoConfig.triggerUrlChange && loadType === ELoadTypes.URL_CHANGE)) {
          const { host } = document.location;
          Logger.color(chrome.runtime.getManifest().name, LoggerColor.PRIMARY, 'debug', host, loadType);
          await ConfigProcessor.checkStartType(manualConfigs, autoConfig);
          Logger.color(chrome.runtime.getManifest().name, LoggerColor.PRIMARY, 'debug', host, 'END');
        }
      } else if (manualConfigs.length > 0 && loadType === ELoadTypes.DOCUMENT) {
        await ConfigProcessor.checkStartType(manualConfigs);
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      statusBar.error(e.message);
    }
    scope.captureException(e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadConfig(ELoadTypes.DOCUMENT);
});

window.addEventListener('load', () => {
  loadConfig(ELoadTypes.WINDOW);
});

addEventListener('unhandledrejection', (event) => {
  if (reloadOnError && event.reason.message === 'Extension context invalidated.') {
    window.location.reload();
    return;
  }
  scope.captureException(event.reason, { captureContext: { tags: { errorType: 'unhandledrejection' } } });
});

self.onerror = (...rest) => {
  scope.captureException({ ...rest }, { captureContext: { tags: { errorType: 'onerror' } } });
};

chrome.runtime.onMessage.addListener(async (message) => {
  const { action, configId } = message;

  if (action === RUNTIME_MESSAGE_ACF.RUN_CONFIG) {
    try {
      new ConfigStorage().getConfigById(configId).then(async (config) => {
        Logger.color(chrome.runtime.getManifest().name, LoggerColor.PRIMARY, 'debug', config?.url, 'START');
        await ConfigProcessor.checkStartType([], config);
        Logger.color(chrome.runtime.getManifest().name, LoggerColor.PRIMARY, 'debug', config?.url, 'END');
      });
    } catch (e) {
      if (e instanceof Error) {
        statusBar.error(e.message);
      }
      scope.captureException(e);
    }
  } else if (action === RUNTIME_MESSAGE_ACF.URL_CHANGE) {
    try {
      await loadConfig(ELoadTypes.URL_CHANGE);
    } catch (e) {
      if (e instanceof Error) {
        statusBar.error(e.message);
      }
      scope.captureException(e);
    }
  }
});
