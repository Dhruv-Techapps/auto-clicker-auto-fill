import { defaultWatchSettings, IWatchSettings } from '@dhruv-techapps/acf-common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../..';
import { openWatchModalAPI } from './watch.api';

export interface IWatchStore {
  visible: boolean;
  watch: IWatchSettings;
  error?: string;
  message?: string;
}

interface IWatchUpdateRequest {
  name: string;
  value: boolean | string | number;
}

const initialState: IWatchStore = {
  visible: false,
  watch: { ...defaultWatchSettings }
};

const slice = createSlice({
  name: 'watch',
  initialState,
  reducers: {
    updateWatch: (state, action: PayloadAction<IWatchUpdateRequest>) => {
      const { name, value } = action.payload;
      // @ts-expect-error "making is generic function difficult for TypeScript"
      state.watch[name] = value;
    },
    updateWatchLifecycleStopConditions: (state, action: PayloadAction<IWatchUpdateRequest>) => {
      const { name, value } = action.payload;
      state.watch.lifecycleStopConditions ??= {};
      (state.watch.lifecycleStopConditions as Record<string, unknown>)[name] = value;
    },
    switchWatchModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'action_watch', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setWatchMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setWatchError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
    }
  },
  extraReducers(builder) {
    builder.addCase(openWatchModalAPI.fulfilled, (state, action) => {
      state.watch = action.payload.watch ? { ...defaultWatchSettings, ...action.payload.watch } : { ...defaultWatchSettings };
      state.visible = true; // always open modal when API resolves
    });
  }
});

export const { updateWatch, updateWatchLifecycleStopConditions, switchWatchModal, setWatchError, setWatchMessage } = slice.actions;
export const watchSelector = (state: RootState) => state.watch;
export const watchReducer = slice.reducer;
