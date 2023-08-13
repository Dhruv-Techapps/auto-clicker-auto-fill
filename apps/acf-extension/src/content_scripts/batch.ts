import { Action, Batch, LOCAL_STORAGE_KEY, Settings } from '@dhruv-techapps/acf-common';
import { DataStore, Logger } from '@dhruv-techapps/core-common';
import { NotificationsService } from '@dhruv-techapps/core-service';
import Actions from './actions';
import { wait } from './util';
import Common from './common';

const LOGGER_LETTER = 'Batch';

const Batch = (() => {
  let batch;
  let actions;
  let sheets;

  const refresh = () => {
    if (document.readyState === 'complete') {
      window.location.reload();
    } else {
      window.addEventListener('load', () => {
        window.location.reload();
      });
    }
  };

  const checkRepeat = async () => {
    const settings = DataStore.getInst().getItem<Settings>(LOCAL_STORAGE_KEY.SETTINGS);
    if (batch.repeat > 0) {
      for (let i = 0; i < batch.repeat; i += 1) {
        console.group(`${LOGGER_LETTER} #${i + 1}`);
        if (batch.repeatInterval) {
          await wait(batch.repeatInterval, `${LOGGER_LETTER} Repeat`, batch.repeat, '<interval>');
        }
        await Actions.start(actions, i + 1, sheets);
        if (settings.notifications.onBatch) {
          NotificationsService.create(chrome.runtime.id, {
            type: 'basic',
            title: 'Batch Completed',
            message: `#${i + 1} Batch`,
            silent: !settings.notifications.sound,
            iconUrl: Common.getNotificationIcon(),
          });
        }
        console.groupEnd();
      }
    } else if (batch.repeat < -1) {
      let i = 1;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (batch.repeatInterval) {
          await wait(batch.repeatInterval, `${LOGGER_LETTER} Repeat`, '∞', '<interval>');
        }
        await Actions.start(actions, i, sheets);
        i += 1;
      }
    }
  };

  const start = async (_batch:Batch, _actions:Array<Action>, _sheets) => {
    try {
      console.group(`${LOGGER_LETTER} #0`);
      batch = _batch;
      actions = _actions;
      sheets = _sheets;
      await Actions.start(_actions, 0, sheets);
      console.groupEnd();
      if (batch.refresh) {
        refresh();
      } else {
        await checkRepeat();
      }
    } catch (error) {
      console.groupEnd();
      throw error;
    }
  };

  return { start };
})();

export default Batch;
