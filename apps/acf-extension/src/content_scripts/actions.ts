import { EActionRunning, EActionStatus, IAction, isUserScript, IUserScript, IWatchSettings } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { ConfigError, isValidUUID } from '@dhruv-techapps/core-common';
import { NotificationsService } from '@dhruv-techapps/core-service';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
import ActionProcessor from './action';
import AddonProcessor from './addon';
import Common from './common';
import { I18N_COMMON, I18N_ERROR } from './i18n';
import Statement from './statement';
import { statusBar } from './status-bar';
import UserScriptProcessor from './userscript';
import DomWatchManager from './util/dom-watch-manager';

const ACTION_I18N = {
  TITLE: chrome.i18n.getMessage('@ACTION__TITLE'),
  NO_NAME: chrome.i18n.getMessage('@ACTION__NO_NAME')
};

const Actions = (() => {
  const checkStatement = async (actions: Array<IAction | IUserScript>, action: IAction | IUserScript) => {
    Statement.check(actions, action.statement);
  };

  const notify = async (action: IAction | IUserScript) => {
    const settings = await new SettingsStorage().getSettings();
    if (settings.notifications?.onAction) {
      NotificationsService.create({
        type: 'basic',
        title: `${ACTION_I18N.TITLE} ${I18N_COMMON.COMPLETED}`,
        message: isUserScript(action) ? 'Userscript' : action.elementFinder,
        silent: !settings.notifications.sound,
        iconUrl: Common.getNotificationIcon()
      });
    }
  };

  const start = async (actions: Array<IAction | IUserScript>, batchRepeat: number, watchSettings?: IWatchSettings) => {
    window.ext.__batchRepeat = batchRepeat;

    // Clear any existing DOM watchers before starting new actions
    DomWatchManager.clear();

    // If watch settings are provided and enabled, set up DOM watcher for the entire configuration
    if (watchSettings?.watchEnabled) {
      // Set up the sequence restart callback for DOM watcher
      DomWatchManager.setSequenceRestartCallback(async () => {
        console.debug(`Actions: Restarting entire action sequence due to DOM changes`);
        await executeActionsFromIndex(actions, 0);
      });

      // Register the configuration-level DOM watcher after actions complete initially
      DomWatchManager.registerConfiguration(actions, watchSettings);
    }

    await executeActionsFromIndex(actions, 0);
  };

  // Helper function to execute actions starting from a specific index
  const executeActionsFromIndex = async (actions: Array<IAction | IUserScript>, startIndex: number) => {
    let i = startIndex;
    while (i < actions.length) {
      const action = actions[i];
      window.ext.__currentActionName = action.name ?? ACTION_I18N.NO_NAME;
      if (action.disabled) {
        console.debug(`${ACTION_I18N.TITLE} #${i + 1}`, `[${window.ext.__currentActionName}]`, `🚫 ${I18N_COMMON.DISABLED} `);
        i += 1;
        continue;
      }
      statusBar.actionUpdate(i + 1, action.name);
      window.ext.__currentAction = i + 1;
      try {
        await checkStatement(actions, action);
        await statusBar.wait(action.initWait, STATUS_BAR_TYPE.ACTION_WAIT);
        await AddonProcessor.check(action.addon, action.settings);
        if (action.type === 'userscript') {
          action.status = await UserScriptProcessor.start(action);
        } else {
          action.status = await ActionProcessor.start(action);
        }
        notify(action);
      } catch (error) {
        if (error === EActionStatus.SKIPPED || error === EActionRunning.SKIP) {
          console.debug(`${ACTION_I18N.TITLE} #${window.ext.__currentAction}`, `[${window.ext.__currentActionName}]`, window.ext.__actionError, `⏭️ ${EActionStatus.SKIPPED}`);
          action.status = EActionStatus.SKIPPED;
        } else if (typeof error === 'number' || (typeof error === 'string' && isValidUUID(error))) {
          const index = typeof error === 'number' ? error : actions.findIndex((a) => a.id === error);
          if (index === -1) {
            throw new ConfigError(I18N_ERROR.ACTION_NOT_FOUND_FOR_GOTO, ACTION_I18N.TITLE);
          }
          console.debug(`${ACTION_I18N.TITLE} #${window.ext.__currentAction}`, `[${window.ext.__currentActionName}]`, window.ext.__actionError, `${I18N_COMMON.GOTO} Action ➡️ ${index + 1}`);
          i = index - 1;
        } else {
          throw error;
        }
      }
      // Increment
      i += 1;
    }
  };
  return { start, getDomWatchManager: () => DomWatchManager };
})();

export default Actions;
