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
  syncSchedule,
  syncWatch,
  updateAction,
  updateBatch,
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

const getMessageFunc = (action: UnknownAction): { message: string } => {
  switch (action.type) {
    case updateConfigSettings.type:
      return { message: i18next.t(`message.configSettings`) };
    case updateBatch.type:
      return { message: i18next.t(`message.batch`) };
    case updateAction.type:
    case reorderActions.type:
    case removeAction.type:
      return { message: i18next.t(`message.action`) };
    case syncActionAddon.type:
      return { message: i18next.t(`message.actionAddon`) };
    case syncWatch.type:
      return { message: i18next.t(`message.watch`) };
    case syncActionStatement.type:
      return { message: i18next.t(`message.actionStatement`) };
    case syncActionSettings.type:
      return { message: i18next.t(`message.actionSettings`) };
    case syncSchedule.type:
      return { message: i18next.t(`message.schedule`) };
    default:
      return { message: i18next.t(`message.config`) };
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
    updateBatch,
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
        const { message } = getMessageFunc(action);
        if (action.type === syncSchedule.type) {
          const { configId, schedule } = action.payload as { configId: string; schedule?: ISchedule };
          if (schedule) {
            ScheduleService.create(configId, schedule);
          } else {
            ScheduleService.clear(configId);
          }
        }
        if (message) {
          listenerApi.dispatch(addToast({ header: action.type, body: message, variant: 'success' }));
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          listenerApi.dispatch(addToast({ header: action.type, body: error.message, variant: 'danger' }));
        } else if (typeof error === 'string') {
          listenerApi.dispatch(addToast({ header: action.type, body: error, variant: 'danger' }));
        } else {
          listenerApi.dispatch(addToast({ header: action.type, body: JSON.stringify(error), variant: 'danger' }));
        }
      });
  }
});

export { configsListenerMiddleware, configsToastListenerMiddleware };
