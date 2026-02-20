import { IWatchSettings } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../config.slice';

export interface SyncWatchPayload {
  watch?: IWatchSettings;
  configId: TRandomUUID;
}

export const watchActions = {
  syncWatch: (state: ConfigStore, action: PayloadAction<SyncWatchPayload>) => {
    const { configId, watch } = action.payload;
    const { configs } = state;
    const cfg = configs.find((c) => c.id === configId);
    if (!cfg) {
      state.error = 'Invalid Configuration';
      return;
    }

    if (watch) {
      cfg.watch = watch;
    } else {
      delete cfg.watch;
    }
    cfg.updated = true;
  }
};
