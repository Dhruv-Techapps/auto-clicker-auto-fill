import { defaultActionWatchSettings, IActionWatchSettings } from '@dhruv-techapps/acf-common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { RootState } from '../../../store';
import { openActionWatchModalAPI } from './action-watch.api';

export interface IActionWatchStore {
  visible: boolean;
  watch: IActionWatchSettings;
  error?: string;
  message?: string;
}

interface IActionWatchUpdateRequest {
  name: string;
  value: boolean | string | number;
}

const initialState: IActionWatchStore = {
  visible: false,
  watch: { ...defaultActionWatchSettings }
};

const slice = createSlice({
  name: 'actionWatch',
  initialState,
  reducers: {
    updateActionWatch: (state, action: PayloadAction<IActionWatchUpdateRequest>) => {
      const { name, value } = action.payload;
      if (name in state.watch) {
        (state.watch as Record<string, typeof value>)[name] = value;
      }
    },
    updateActionWatchLifecycleStopConditions: (state, action: PayloadAction<IActionWatchUpdateRequest>) => {
      const { name, value } = action.payload;
      state.watch.lifecycleStopConditions ??= {};
      (state.watch.lifecycleStopConditions as Record<string, unknown>)[name] = value;
    },
    switchActionWatchModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'action_watch', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setActionWatchMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setActionWatchError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      Sentry.captureException(state.error);
      state.message = undefined;
    }
  },
  extraReducers(builder) {
    builder.addCase(openActionWatchModalAPI.fulfilled, (state, action) => {
      state.watch = action.payload.watch ? { ...defaultActionWatchSettings, ...action.payload.watch } : { ...defaultActionWatchSettings };
      state.visible = !state.visible;
    });
  }
});

export const { updateActionWatch, updateActionWatchLifecycleStopConditions, switchActionWatchModal, setActionWatchError, setActionWatchMessage } = slice.actions;
export const actionWatchSelector = (state: RootState) => state.actionWatch;
export const actionWatchReducer = slice.reducer;
