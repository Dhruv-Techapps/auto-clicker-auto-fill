import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { setSettingsError, setSettingsMessage, updateSettings, updateSettingsBackup, updateSettingsNotification } from './settings.slice';
import { RootState } from '../../store';
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { StorageService } from '@dhruv-techapps/core-service';
import { getI18n } from 'react-i18next';

const settingsListenerMiddleware = createListenerMiddleware();

settingsListenerMiddleware.startListening({
  matcher: isAnyOf(updateSettings, updateSettingsBackup, updateSettingsNotification),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const i18n = getI18n();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const language: any = i18n.getDataByLanguage(i18n.language)?.['web-new'];
    await StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.SETTINGS]: state.settings.settings }).then(
      () => listenerApi.dispatch(setSettingsMessage(language.modal.settings.saveMessage)),
      (error) => listenerApi.dispatch(setSettingsError(error))
    );
  },
});

export { settingsListenerMiddleware };
