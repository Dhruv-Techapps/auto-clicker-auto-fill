import { IConfiguration, ISchedule, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { createListenerMiddleware, isAnyOf, UnknownAction } from '@reduxjs/toolkit';

import i18next from 'i18next';
import { RootState } from '../store';
import { addToast } from '../toast.slice';

import { ScheduleService } from '@dhruv-techapps/acf-service';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import {
  addConfig,
  duplicateConfig,
  importConfigs,
  removeAction,
  removeConfigs,
  reorderActions,
  syncActionAddon,
  syncActionSettings,
  syncActionStatement,
  syncBatch,
  syncSchedule,
  syncWatch,
  updateAction,
  updateConfig
} from './config.slice';

const configsToastListenerMiddleware = createListenerMiddleware();
configsToastListenerMiddleware.startListening({
  matcher: isAnyOf(addConfig),
  effect: async (action, listenerApi) => {
    const header = i18next.t(`automation.toast.header`);
    const body = i18next.t(`automation.toast.add`);
    if (header) {
      listenerApi.dispatch(addToast({ header, body }));
    }
  }
});

const getMessageFunc = (action: UnknownAction): { header: string; body: string } => {
  switch (action.type) {
    case syncBatch.type:
      return { header: i18next.t(`loop.toast.header`), body: i18next.t(`loop.toast.body`) };
    case updateAction.type:
    case reorderActions.type:
    case removeAction.type:
      return { header: i18next.t(`step.toast.header`), body: i18next.t(`step.toast.body`) };
    case syncActionAddon.type:
      return { header: i18next.t(`pageGuard.toast.header`), body: i18next.t(`pageGuard.toast.body`) };
    case syncWatch.type:
      return { header: i18next.t(`monitor.toast.header`), body: i18next.t(`monitor.toast.body`) };
    case syncActionStatement.type:
      return { header: i18next.t(`stateGuard.toast.header`), body: i18next.t(`stateGuard.toast.body`) };
    case syncActionSettings.type:
      return { header: i18next.t(`stepSettings.toast.header`), body: i18next.t(`stepSettings.toast.body`) };
    case syncSchedule.type:
      return { header: i18next.t(`automation.toast.header`), body: i18next.t(`automation.toast.schedule`) };
    case removeConfigs.type:
      return { header: i18next.t(`automations.toast.header`), body: i18next.t(`automations.toast.remove`, { count: (action.payload as TRandomUUID[]).length }) };
    case importConfigs.type:
      return { header: i18next.t(`automations.toast.header`), body: i18next.t(`automations.toast.import`, { count: (action.payload as IConfiguration[]).length }) };
    case duplicateConfig.type:
      return { header: i18next.t(`automation.toast.header`), body: i18next.t(`automation.toast.duplicate`) };
    default:
      return { header: i18next.t(`automation.toast.header`), body: i18next.t(`automation.toast.body`) };
  }
};

const configsListenerMiddleware = createListenerMiddleware();
configsListenerMiddleware.startListening({
  matcher: isAnyOf(
    importConfigs,
    updateConfig,
    removeConfigs,
    duplicateConfig,
    syncBatch,
    updateAction,
    reorderActions,
    removeAction,
    syncActionAddon,
    syncWatch,
    syncSchedule,
    syncActionSettings,
    syncActionStatement
  ),
  effect: async (action, listenerApi) => {
    // Run whatever additional side-effect-y logic you want here
    const state = listenerApi.getState() as RootState;

    StorageService.set({ [LOCAL_STORAGE_KEY.CONFIGS]: state.configuration.configs })
      .then(() => {
        if (action.type === syncSchedule.type) {
          const { configId, schedule } = action.payload as { configId: string; schedule?: ISchedule };
          if (schedule) {
            ScheduleService.create(configId, schedule);
          } else {
            ScheduleService.clear(configId);
          }
        }
        const { header, body } = getMessageFunc(action);
        if (body) {
          listenerApi.dispatch(addToast({ header, body, variant: 'success' }));
        }
      })
      .catch((error) => {
        const { header } = getMessageFunc(action);
        if (error instanceof Error) {
          listenerApi.dispatch(addToast({ header, body: error.message, variant: 'danger' }));
        } else if (typeof error === 'string') {
          listenerApi.dispatch(addToast({ header, body: error, variant: 'danger' }));
        } else {
          listenerApi.dispatch(addToast({ header, body: JSON.stringify(error), variant: 'danger' }));
        }
      });
  }
});

export { configsListenerMiddleware, configsToastListenerMiddleware };
