import { IWatchSettings } from '@dhruv-techapps/acf-common';
import { PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { ConfigStore } from '../config.slice';

export const watchActions = {
  syncWatch: (state: ConfigStore, action: PayloadAction<IWatchSettings | undefined>) => {
    const { configs, selectedConfigId } = state;
    const cfg = configs.find((c) => c.id === selectedConfigId);
    if (!cfg) {
      state.error = 'Invalid Configuration';
      Sentry.captureException(state.error);
      return;
    }

    if (action.payload) {
      cfg.watch = action.payload;
    } else {
      delete cfg.watch;
    }
    cfg.updated = true;
  }
};
