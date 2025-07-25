import { defaultActionSettings, IActionSettings, TGoto } from '@dhruv-techapps/acf-common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../../../store';
import { openActionSettingsModalAPI } from './action-settings.api';

export interface IActionSettingsStore {
  visible: boolean;
  error?: string;
  message?: string;
  settings: IActionSettings;
}

export interface IActionSettingsRequest {
  name: string;
  value: boolean;
}

const initialState: IActionSettingsStore = { visible: false, settings: { ...defaultActionSettings } };

const slice = createSlice({
  name: 'actionSettings',
  initialState,
  reducers: {
    updateActionSettings: (state, action: PayloadAction<IActionSettingsRequest>) => {
      const { name, value } = action.payload;
      // @ts-expect-error "making is generic function difficult for TypeScript"
      state.settings[name] = value;
    },
    switchActionSettingsModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'action_settings', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setActionSettingsMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setActionSettingsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
    },
    updateActionSettingsGoto: (state, action: PayloadAction<TGoto>) => {
      state.settings.retryGoto = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(openActionSettingsModalAPI.fulfilled, (state, action) => {
      if (action.payload.settings) {
        state.settings = { ...action.payload.settings, retryGoto: action.payload.retryGoto };
      } else {
        state.settings = { ...defaultActionSettings };
      }
      state.visible = !state.visible;
    });
  }
});

export const { updateActionSettings, switchActionSettingsModal, updateActionSettingsGoto, setActionSettingsMessage, setActionSettingsError } = slice.actions;

export const actionSettingsSelector = (state: RootState) => state.actionSettings;
export const actionSettingsReducer = slice.reducer;
