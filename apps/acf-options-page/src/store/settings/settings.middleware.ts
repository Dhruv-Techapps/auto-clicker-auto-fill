import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { RootState } from '../store';
import { addToast } from '../toast.slice';
import { updateSettings, updateSettingsBackup, updateSettingsNotification } from './settings.slice';

const settingsListenerMiddleware = createListenerMiddleware();

settingsListenerMiddleware.startListening({
  matcher: isAnyOf(updateSettings, updateSettingsBackup, updateSettingsNotification),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    StorageService.set({ [LOCAL_STORAGE_KEY.SETTINGS]: state.settings.settings })
      .then(() => {
        const header = i18next.t(`settings.toast.header`);
        const body = i18next.t(`settings.toast.body`);
        listenerApi.dispatch(addToast({ header, body, variant: 'success' }));
      })
      .catch((error) => {
        const header = i18next.t(`settings.toast.header`);
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

export { settingsListenerMiddleware };
