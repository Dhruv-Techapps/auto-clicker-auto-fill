import { EActionStatus, EErrorOptions, IAction, isUserScript, IUserScript, TActionResult } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { ConfigError, generateUUID } from '@dhruv-techapps/core-common';
import { LoggerService, OpenTelemetryService } from '@dhruv-techapps/core-open-telemetry/content-script';
import { NotificationsService } from '@dhruv-techapps/core-service';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
import ActionProcessor from './action';
import AddonProcessor from './addon';
import Common from './common';
import { I18N_COMMON, I18N_ERROR } from './i18n';
import Statement from './statement';
import { statusBar } from './status-bar';
import UserScriptProcessor from './userscript';

const ACTION_I18N = {
  TITLE: chrome.i18n.getMessage('@ACTION__TITLE'),
  NO_NAME: chrome.i18n.getMessage('@ACTION__NO_NAME')
};

const Actions = (() => {
  const checkStatement = async (actions: Array<IAction | IUserScript>, action: IAction | IUserScript): Promise<TActionResult | null> => {
    return Statement.check(actions, action.statement);
  };

  const notify = async (action: IAction | IUserScript) => {
    const settings = await SettingsStorage.getSettings();
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

  // Helper function to handle action status results (SKIP or GOTO)
  // Returns the new index to jump to, or null to continue normally
  // Note: Returned index is used directly (with continue), not decremented
  const handleStatusResult = (result: TActionResult, actions: Array<IAction | IUserScript>, action: IAction | IUserScript, currentIndex: number): number | null => {
    if (result.status === EActionStatus.SKIPPED) {
      console.debug(`${ACTION_I18N.TITLE} #${window.ext.__currentAction}`, `[${window.ext.__currentActionName}]`, window.ext.__actionError, `⏭️ ${EActionStatus.SKIPPED}`);
      action.status = EActionStatus.SKIPPED;
      return currentIndex + 1; // Skip to next action
    } else if (result.status === EErrorOptions.GOTO) {
      const index = typeof result.goto === 'number' ? result.goto : actions.findIndex((a) => a.id === result.goto);
      if (index === -1) {
        throw new ConfigError(I18N_ERROR.ACTION_NOT_FOUND_FOR_GOTO, ACTION_I18N.TITLE);
      }
      console.debug(`${ACTION_I18N.TITLE} #${window.ext.__currentAction}`, `[${window.ext.__currentActionName}]`, window.ext.__actionError, `${I18N_COMMON.GOTO} Action ➡️ ${index + 1}`);
      return index; // Jump to target action
    }
    return null;
  };

  const start = async (actions: Array<IAction | IUserScript>, batchRepeat: number) => {
    window.ext.__batchRepeat = batchRepeat;
    let i = 0;
    while (i < actions.length) {
      const action = actions[i];
      window.ext.__currentActionName = action.name ?? ACTION_I18N.NO_NAME;
      if (action.disabled) {
        console.debug(`${ACTION_I18N.TITLE} #${i + 1}`, `[${window.ext.__currentActionName}]`, `🚫 ${I18N_COMMON.DISABLED} `);
        LoggerService.info(`Action #${i + 1} [${window.ext.__currentActionName}] 🚫 (Disabled)`);
        i += 1;
        continue;
      }
      window.ext.__currentAction = i + 1;
      window.ext.__actionKey = generateUUID();
      try {
        window.ext.__actionHeaders = await OpenTelemetryService.startSpan(window.ext.__actionKey, `${ACTION_I18N.TITLE} #${i + 1}`, { headers: window.ext.__batchHeaders });
        // Check statement and handle status result
        const statementResult = await checkStatement(actions, action);
        if (statementResult) {
          const newIndex = handleStatusResult(statementResult, actions, action, i);
          if (newIndex !== null) {
            i = newIndex;
            continue;
          }
        }

        await statusBar.wait(action.initWait, STATUS_BAR_TYPE.ACTION_WAIT);

        // Check addon and handle status result
        const addonResult = await AddonProcessor.check(action.addon, action.settings);
        if (addonResult) {
          const newIndex = handleStatusResult(addonResult, actions, action, i);
          if (newIndex !== null) {
            i = newIndex;
            continue;
          }
        }

        // Execute action and handle status result
        if (action.type === 'userscript') {
          action.status = await UserScriptProcessor.start(action);
        } else {
          const actionResult = await ActionProcessor.start(action);
          // ActionProcessor can return status object or DONE enum
          if (typeof actionResult === 'object') {
            const newIndex = handleStatusResult(actionResult, actions, action, i);
            if (newIndex !== null) {
              i = newIndex;
              continue;
            }
          } else {
            action.status = actionResult;
          }
        }

        notify(action);
      } catch (error) {
        OpenTelemetryService.recordException(window.ext.__actionKey, error as Error);
        throw error;
      } finally {
        OpenTelemetryService.endSpan(window.ext.__actionKey);
        window.ext.__actionHeaders = undefined;
      }
      // Increment
      i += 1;
    }
  };
  return { start };
})();

export default Actions;
