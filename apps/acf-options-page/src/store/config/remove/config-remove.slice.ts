import { IConfiguration } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../../store';
import { configRemoveUpdateAPI } from './config-remove.api';

export type ConfigurationRemoveType = IConfiguration & { checked?: boolean };

export interface IConfigRemoveStore {
  visible: boolean;
  error?: string;
  message?: string;
  configs?: Array<ConfigurationRemoveType>;
}

const initialState: IConfigRemoveStore = { visible: false };

const slice = createSlice({
  name: 'configRemove',
  initialState,
  reducers: {
    switchConfigRemoveModal: (state, action: PayloadAction<Array<IConfiguration> | undefined>) => {
      if (action.payload) {
        state.configs = action.payload;
      }
      window.dataLayer.push({ event: 'modal', name: 'config_remove', visibility: !state.visible });
      state.visible = !state.visible;
    },
    switchConfigRemoveSelection: (state, action: PayloadAction<TRandomUUID>) => {
      if (state.configs) {
        const config = state.configs.find((config) => config.id === action.payload);
        if (!config) {
          state.error = 'Invalid Config';
          Sentry.captureException(state.error);
          return;
        }

        config.checked = !config.checked;
      }
    },
    setConfigRemoveMessage: (state, action: PayloadAction<string | undefined>) => {
      state.error = undefined;
      state.message = action.payload;
    },
    updateRemoveConfiguration: (state, action) => {
      state.configs = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(configRemoveUpdateAPI.rejected, (state, action) => {
      state.error = action.error.message;
      Sentry.captureException(state.error);
      state.message = undefined;
    });
    builder.addCase(configRemoveUpdateAPI.fulfilled, (state) => {
      state.visible = false;
    });
  }
});

export const { switchConfigRemoveSelection, switchConfigRemoveModal, updateRemoveConfiguration, setConfigRemoveMessage } = slice.actions;

export const configRemoveSelector = (state: RootState) => state.configRemove;
export const configRemoveReducer = slice.reducer;
