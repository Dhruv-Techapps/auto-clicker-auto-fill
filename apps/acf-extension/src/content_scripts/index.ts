import { ELoadTypes, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { ConfigStorage, GetConfigResult, SettingsStorage } from '@dhruv-techapps/acf-store';
import { IExtension, Logger, LoggerColor } from '@dhruv-techapps/core-common';
import { scope } from '../common/instrument';
import ConfigProcessor from './config';
import { statusBar } from './status-bar';
import DomWatchManager from './util/dom-watch-manager';

scope.setTag('page', 'content-script');

declare global {
  interface Window {
    ext: IExtension;
  }
}

window.ext = window.ext || {};

let reloadOnError = false;
new SettingsStorage().getSettings().then((settings) => {
  if (settings.reloadOnError !== undefined) {
    reloadOnError = settings.reloadOnError;
  }
});

async function loadConfig(loadType: ELoadTypes) {
  try {
    new ConfigStorage().getConfig().then(async ({ autoConfig, manualConfigs }: GetConfigResult) => {
      if (autoConfig) {
        if (autoConfig.loadType === loadType || loadType === ELoadTypes.URL_CHANGE) {
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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const { action, configId, command } = message;

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
  } else if (action === RUNTIME_MESSAGE_ACF.DOM_WATCHER_GET_STATUS) {
    // Handle DOM watcher status request
    try {
      const status = DomWatchManager.getStatus();
      sendResponse(status);
    } catch (e) {
      console.error('Error getting DOM watcher status:', e);
      sendResponse({ isActive: false, watchedActionsCount: 0, watchedActions: [] });
    }
    return true; // Keep message channel open for async response
  } else if (action === RUNTIME_MESSAGE_ACF.DOM_WATCHER_COMMAND) {
    // Handle DOM watcher commands
    try {
      const domWatchManager = DomWatchManager;

      switch (command) {
        case 'START':
          domWatchManager.start();
          break;
        case 'STOP':
          domWatchManager.stop();
          break;
        case 'PAUSE':
          domWatchManager.pause();
          break;
        case 'RESUME':
          domWatchManager.resume();
          break;
        case 'CLEAR':
          domWatchManager.clear();
          break;
        default:
          console.warn('Unknown DOM watcher command:', command);
      }

      sendResponse({ success: true });
    } catch (e) {
      console.error('Error handling DOM watcher command:', e);
      if (e instanceof Error) sendResponse({ success: false, error: e.message });
    }
    return true; // Keep message channel open for async response
  }
});
