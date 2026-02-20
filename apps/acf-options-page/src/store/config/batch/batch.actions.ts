import { IBatch } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../config.slice';

export interface SyncBatchPayload {
  batch: IBatch;
  configId: TRandomUUID;
}

export const batchActions = {
  syncBatch: (state: ConfigStore, action: PayloadAction<SyncBatchPayload>) => {
    const { configId, batch } = action.payload;
    const { configs } = state;
    const config = configs.find((config) => config.id === configId);
    if (!config) {
      state.error = 'Invalid Configuration';
      return;
    }

    if (batch) {
      config.batch = batch;
    } else {
      delete config.batch;
    }
    config.updated = true;
  }
};
