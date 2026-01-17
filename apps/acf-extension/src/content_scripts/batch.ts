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

  const notifyCompletion = async (batchCount: number) => {
    const { notifications } = await SettingsStorage.getSettings();
    if (notifications?.onBatch) {
      NotificationsService.create({
        type: 'basic',
        title: `${BATCH_I18N.TITLE} ${I18N_COMMON.COMPLETED}`,
        message: `#${batchCount} ${BATCH_I18N.TITLE}`,
        silent: !notifications.sound,
        iconUrl: Common.getNotificationIcon()
      });
    }
  };

  const start = async (actions: Array<IAction | IUserScript>, batch?: IBatch) => {
    let batchCount = 1;
    const batchRepeat = batch?.repeat ?? 0;
    do {
      const key = generateUUID();
      try {
        console.groupCollapsed(`${BATCH_I18N.TITLE} #${batchCount} ${batchCount === 1 ? `(${I18N_COMMON.DEFAULT})` : `[${I18N_COMMON.REPEAT}]`}`);
        window.ext.__batchHeaders = await OpenTelemetryService.startSpan(key, `BATCH #${batchCount}`, { headers: window.ext.__configHeaders });
        if (batchCount !== 1 && batch?.repeatInterval) {
          await statusBar.wait(batch.repeatInterval, STATUS_BAR_TYPE.BATCH_REPEAT);
        }
        statusBar.batchUpdate(batchRepeat < 0 ? '∞' : batchCount);
        await Actions.start(actions, batchCount);
        await notifyCompletion(batchCount);
        if (batch?.refresh) {
          refresh();
        }
        batchCount++;
      } finally {
        OpenTelemetryService.endSpan(key);
        window.ext.__batchHeaders = undefined;
        console.groupEnd();
      }
    } while (batchRepeat < -1 || batchCount <= batchRepeat + 1);
  };

  return { start };
})();

export default BatchProcessor;
