import { IAction, IBatch, IUserScript } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { generateUUID } from '@dhruv-techapps/core-common';
import { OpenTelemetryService } from '@dhruv-techapps/core-open-telemetry/content-script';
import { NotificationsService } from '@dhruv-techapps/core-service';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
import Actions from './actions';
import Common from './common';
import { I18N_COMMON } from './i18n';
import { statusBar } from './status-bar';

const BATCH_I18N = {
  TITLE: chrome.i18n.getMessage('@BATCH__TITLE')
};

const BatchProcessor = (() => {
  const refresh = () => {
    if (document.readyState === 'complete') {
      window.location.reload();
    } else {
      window.addEventListener('load', () => {
        window.location.reload();
      });
    }
  };

  const checkRepeat = async (actions: Array<IAction | IUserScript>, batch: IBatch) => {
    if (batch.repeat) {
      if (batch.repeat > 0) {
        for (let i = 2; i <= batch.repeat + 1; i++) {
          const key = generateUUID();
          window.ext.__batchHeaders = await OpenTelemetryService.startSpan(key, `${BATCH_I18N.TITLE} #${i}`, { headers: window.ext.__configHeaders });
          statusBar.batchUpdate(i);
          console.groupCollapsed(`${BATCH_I18N.TITLE} #${i} [${I18N_COMMON.REPEAT}]`);
          if (batch.repeatInterval) {
            await statusBar.wait(batch.repeatInterval, STATUS_BAR_TYPE.BATCH_REPEAT);
          }
          await Actions.start(actions, i);
          const { notifications } = await SettingsStorage.getSettings();
          if (notifications?.onBatch) {
            NotificationsService.create({
              type: 'basic',
              title: `${BATCH_I18N.TITLE} ${I18N_COMMON.COMPLETED}`,
              message: `#${i} ${BATCH_I18N.TITLE}`,
              silent: !notifications.sound,
              iconUrl: Common.getNotificationIcon()
            });
          }
          OpenTelemetryService.endSpan(key);
          window.ext.__batchHeaders = undefined;
          console.groupEnd();
        }
      } else if (batch.repeat < -1) {
        let i = 1;

        while (true) {
          if (batch?.repeatInterval) {
            statusBar.batchUpdate('∞');
            await statusBar.wait(batch?.repeatInterval, STATUS_BAR_TYPE.BATCH_REPEAT);
          }
          await Actions.start(actions, i);
          i += 1;
        }
      }
    }
  };

  const start = async (actions: Array<IAction | IUserScript>, batch?: IBatch) => {
    const key = generateUUID();
    try {
      console.groupCollapsed(`${BATCH_I18N.TITLE} #1 (${I18N_COMMON.DEFAULT})`);
      window.ext.__batchHeaders = await OpenTelemetryService.startSpan(key, `${BATCH_I18N.TITLE} #1`, { headers: window.ext.__configHeaders });
      statusBar.batchUpdate(1);
      await Actions.start(actions, 1);
      OpenTelemetryService.endSpan(key);
      window.ext.__batchHeaders = undefined;
      console.groupEnd();
      if (batch) {
        if (batch.refresh) {
          refresh();
        } else {
          await checkRepeat(actions, batch);
        }
      }
    } catch (error) {
      throw error;
    } finally {
      console.groupEnd();
      OpenTelemetryService.endSpan(key);
      window.ext.__batchHeaders = undefined;
    }
  };

  return { start };
})();

export default BatchProcessor;
