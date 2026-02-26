import { ISchedule } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../config.slice';

export interface SyncSchedulePayload {
  configId: TRandomUUID;
  schedule?: ISchedule;
}

export const scheduleActions = {
  syncSchedule: (state: ConfigStore, action: PayloadAction<SyncSchedulePayload>) => {
    const { configId, schedule } = action.payload;
    const { configs } = state;

    const selectedConfig = configs.find((config) => config.id === configId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';

      return;
    }

    if (schedule) {
      selectedConfig.schedule = schedule;
    } else {
      delete selectedConfig.schedule;
    }
    selectedConfig.updated = true;
  }
};
