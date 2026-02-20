import { ISchedule, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { createListenerMiddleware, isAnyOf, UnknownAction } from '@reduxjs/toolkit';

import i18next from 'i18next';
import { RootState } from '../store';
import { addToast } from '../toast.slice';

import { ScheduleService } from '@dhruv-techapps/acf-service';
import {
  addConfig,
  duplicateConfig,
  importAll,
  importConfig,
  removeAction,
  removeConfig,
  reorderActions,
  syncActionAddon,
  syncActionSettings,
  syncActionStatement,
  syncBatch,
  syncSchedule,
  syncWatch,
  updateAction,
  updateConfig,
  updateConfigSettings
} from './config.slice';

const configsToastListenerMiddleware = createListenerMiddleware();
configsToastListenerMiddleware.startListening({
  matcher: isAnyOf(addConfig, removeConfig, duplicateConfig),
  effect: async (action, listenerApi) => {
    const [type, method] = action.type.split('/');

    const header = i18next.t(`toast.${type}.${method}.header`, { name: type });
    const body = i18next.t(`toast.${type}.${method}.body`, { name: type });
    if (header) {
      listenerApi.dispatch(addToast({ header, body }));
    }
  }
});

const getMessageFunc = (action: UnknownAction): { header: string; body: string } => {
  switch (action.type) {
    case updateConfigSettings.type:
      return { header: i18next.t(`toast.config.header`), body: i18next.t(`toast.config.settings`) };
    case syncBatch.type:
      return { header: i18next.t(`toast.batch.header`), body: i18next.t(`toast.batch.body`) };
    case updateAction.type:
    case reorderActions.type:
    case removeAction.type:
      return { header: i18next.t(`toast.action.header`), body: i18next.t(`toast.action.body`) };
    case syncActionAddon.type:
      return { header: i18next.t(`toast.actionAddon.header`), body: i18next.t(`toast.actionAddon.body`) };
    case syncWatch.type:
      return { header: i18next.t(`toast.watch.header`), body: i18next.t(`toast.watch.body`) };
    case syncActionStatement.type:
      return { header: i18next.t(`toast.actionStatement.header`), body: i18next.t(`toast.actionStatement.body`) };
    case syncActionSettings.type:
      return { header: i18next.t(`toast.actionSettings.header`), body: i18next.t(`toast.actionSettings.body`) };
    case syncSchedule.type:
      return { header: i18next.t(`toast.config.header`), body: i18next.t(`toast.config.schedule`) };
    default:
      return { header: i18next.t(`toast.config.header`), body: i18next.t(`toast.config.body`) };
  }
};

const configsListenerMiddleware = createListenerMiddleware();
configsListenerMiddleware.startListening({
  matcher: isAnyOf(
    importAll,
    importConfig,
    updateConfig,
    updateConfigSettings,
    removeConfig,
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
