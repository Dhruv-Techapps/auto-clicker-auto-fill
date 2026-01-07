import { ISchedule } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../config.slice';

export const scheduleActions = {
  syncSchedule: (state: ConfigStore, action: PayloadAction<ISchedule | undefined>) => {
    const { configs, selectedConfigId } = state;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      GoogleAnalyticsService.fireErrorEvent('syncSchedule', 'Invalid Configuration');
      return;
    }

    if (action.payload) {
      selectedConfig.schedule = action.payload;
    } else {
      delete selectedConfig.schedule;
    }
    selectedConfig.updated = true;
  }
};
