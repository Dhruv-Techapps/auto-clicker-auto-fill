import { IDiscord, ISettings, defaultSettings, defaultSettingsNotifications } from '@dhruv-techapps/acf-common';
import { EAutoBackup } from '@dhruv-techapps/shared-google-drive/service';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { discordDeleteAPI, discordGetAPI, discordLoginAPI, settingsGetAPI } from './settings.api';

export interface ISettingsStore {
  visible: boolean;
  loading: boolean;
  error?: string;
  settings: ISettings;
  discord?: IDiscord;
  message?: string;
}

export interface ISettingsAction {
  name: string;
  value: boolean;
}

const initialState: ISettingsStore = { visible: false, loading: true, settings: defaultSettings };

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
    updateSettings: (state, action: PayloadAction<ISettingsAction>) => {
      const { name, value } = action.payload;
      // @ts-expect-error "making is generic function difficult for TypeScript"
      state.settings[name] = value;
    },
    updateSettingsNotification: (state, action: PayloadAction<ISettingsAction>) => {
      const { name, value } = action.payload;
      if (state.settings.notifications) {
        // @ts-expect-error "making is generic function difficult for TypeScript"
        state.settings.notifications[name] = value;
      } else {
        state.settings.notifications = { ...defaultSettingsNotifications, [name]: value };
      }
    },
    updateSettingsBackup: (state, action: PayloadAction<EAutoBackup>) => {
      if (state.settings.backup) {
        state.settings.backup.autoBackup = action.payload;
      } else {
        state.settings.backup = { autoBackup: action.payload };
      }
    },
    setSettingsError: (state, action) => {
      state.error = action.payload;
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

      state.loading = false;
    });
    builder.addCase(discordLoginAPI.fulfilled, (state, action) => {
      state.discord = action.payload;
    });
    builder.addCase(discordLoginAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(discordDeleteAPI.fulfilled, (state) => {
      delete state.discord;
    });
    builder.addCase(discordDeleteAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
  }
});

export const { switchSettingsModal, setSettingsError, updateSettings, setSettingsMessage, updateSettingsNotification, updateSettingsBackup } = slice.actions;

export const settingsSelector = (state: RootState) => state.settings;

export const settingsReducer = slice.reducer;
