import { RootState } from '@acf-options-page/store';
import { ISchedule, defaultSchedule } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { openScheduleModalAPI } from './schedule.api';

export interface IScheduleStore {
  visible: boolean;
  error?: string;
  message?: string;
  schedule: ISchedule;
}

const initialState: IScheduleStore = { visible: false, schedule: { ...defaultSchedule } };

const slice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    updateSchedule: (state, action) => {
      const { name, value } = action.payload;
      // @ts-expect-error "making is generic function difficult for TypeScript"
      state.schedule[name] = value;
    },
    switchScheduleModal: (state) => {
      window.dataLayer.push({ event: 'modal', name: 'schedule', visibility: !state.visible });
      state.visible = !state.visible;
    },
    setScheduleMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setScheduleError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
      GoogleAnalyticsService.fireErrorEvent('Schedule Modal', state.error || 'Unknown Error');
      state.message = undefined;
    }
  },
  extraReducers(builder) {
    builder.addCase(openScheduleModalAPI.fulfilled, (state, action) => {
      if (action.payload) {
        state.schedule = { ...action.payload };
      } else {
        state.schedule = { ...defaultSchedule };
      }
      state.visible = !state.visible;
    });
  }
});

export const { setScheduleError, setScheduleMessage, switchScheduleModal, updateSchedule } = slice.actions;

export const scheduleSelector = (state: RootState) => state.schedule;
export const scheduleReducer = slice.reducer;
