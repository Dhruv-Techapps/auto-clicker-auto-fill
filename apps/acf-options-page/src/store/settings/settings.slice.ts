import { Discord, Settings, defaultSettings, defaultSettingsNotifications } from '@dhruv-techapps/acf-common';
import { AUTO_BACKUP } from '@dhruv-techapps/shared-google-drive';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../store';
import { discordDeleteAPI, discordGetAPI, discordLoginAPI, settingsGetAPI } from './settings.api';

type SettingsStore = {
  visible: boolean;
  loading: boolean;
  error?: string;
  settings: Settings;
  discord?: Discord;
  message?: string;
};

type SettingsAction = {
  name: string;
  value: boolean;
};

const initialState: SettingsStore = { visible: false, loading: true, settings: defaultSettings };

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchSettingsModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'global_settings', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setSettingsMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    updateSettings: (state, action: PayloadAction<SettingsAction>) => {
      const { name, value } = action.payload;
      // @ts-expect-error "making is generic function difficult for TypeScript"
      state.settings[name] = value;
    },
    updateSettingsNotification: (state, action: PayloadAction<SettingsAction>) => {
      const { name, value } = action.payload;
      if (state.settings.notifications) {
        // @ts-expect-error "making is generic function difficult for TypeScript"
        state.settings.notifications[name] = value;
      } else {
        state.settings.notifications = { ...defaultSettingsNotifications, [name]: value };
      }
    },
    updateSettingsBackup: (state, action: PayloadAction<AUTO_BACKUP>) => {
      if (state.settings.backup) {
        state.settings.backup.autoBackup = action.payload;
      } else {
        state.settings.backup = { autoBackup: action.payload };
      }
    },
    setSettingsError: (state, action) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(settingsGetAPI.fulfilled, (state, action) => {
      if (action.payload && Object.keys(action.payload).length) {
        state.settings = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(settingsGetAPI.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
      state.loading = false;
    });
    builder.addCase(discordGetAPI.pending, (state) => {
      delete state.error;
      state.loading = true;
    });
    builder.addCase(discordGetAPI.fulfilled, (state, action) => {
      state.discord = action.payload;
      state.loading = false;
    });
    builder.addCase(discordGetAPI.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
      state.loading = false;
    });
    builder.addCase(discordLoginAPI.fulfilled, (state, action) => {
      state.discord = action.payload;
    });
    builder.addCase(discordLoginAPI.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
    });
    builder.addCase(discordDeleteAPI.fulfilled, (state) => {
      delete state.discord;
    });
    builder.addCase(discordDeleteAPI.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
    });
  }
});

export const { switchSettingsModal, setSettingsError, updateSettings, setSettingsMessage, updateSettingsNotification, updateSettingsBackup } = slice.actions;

export const settingsSelector = (state: RootState) => state.settings;

export const settingsReducer = slice.reducer;
