import { IAction, IBatch, IUserScript } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { NotificationsService } from '@dhruv-techapps/core-service';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
import Actions from './actions';
import Common from './common';
import { I18N_COMMON } from './i18n';
import { logger } from './logger';
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
        for (let i = 0; i < batch.repeat; i += 1) {
          statusBar.batchUpdate(i + 2);
          logger.debug(['BATCH', `#${i + 2}`, I18N_COMMON.REPEAT], 'Starting repeat batch');
          if (batch?.repeatInterval) {
            await statusBar.wait(batch?.repeatInterval, STATUS_BAR_TYPE.BATCH_REPEAT, i + 2);
          }
          await Actions.start(actions, i + 2);
          const { notifications } = await new SettingsStorage().getSettings();
          if (notifications?.onBatch) {
            NotificationsService.create({
              type: 'basic',
              title: `${BATCH_I18N.TITLE} ${I18N_COMMON.COMPLETED}`,
              message: `#${i + 1} ${BATCH_I18N.TITLE}`,
              silent: !notifications.sound,
              iconUrl: Common.getNotificationIcon()
            });
          }
          logger.debug(['BATCH', `#${i + 2}`, I18N_COMMON.REPEAT], 'Completed repeat batch');
        }
      } else if (batch.repeat < -1) {
        let i = 1;

        while (true) {
          if (batch?.repeatInterval) {
            statusBar.batchUpdate('∞');
            await statusBar.wait(batch?.repeatInterval, STATUS_BAR_TYPE.BATCH_REPEAT, '∞');
          }
          await Actions.start(actions, i);
          i += 1;
        }
      }
    }
  };

  const start = async (actions: Array<IAction | IUserScript>, batch?: IBatch) => {
    try {
      statusBar.batchUpdate(1);
      logger.debug(['BATCH', '#1', I18N_COMMON.DEFAULT], 'Starting default batch');
      await Actions.start(actions, 1);
      logger.debug(['BATCH', '#1', I18N_COMMON.DEFAULT], 'Completed default batch');
      if (batch) {
        if (batch.refresh) {
          refresh();
        } else {
          await checkRepeat(actions, batch);
        }
      }
    } catch (error) {
      logger.error(['BATCH'], 'Batch execution failed', error);
      throw error;
    }
  };

  return { start };
})();

export default BatchProcessor;
