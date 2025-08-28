import { IAction, IActionWatchSettings } from '@dhruv-techapps/acf-common';
import { PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { ConfigStore } from '../../config.slice';

export const actionWatchActions = {
  syncActionWatch: (state: ConfigStore, action: PayloadAction<IActionWatchSettings | undefined>) => {
    const { configs, selectedActionId, selectedConfigId } = state;
    const cfg = configs.find((c) => c.id === selectedConfigId);
    if (!cfg) {
      state.error = 'Invalid Configuration';
      Sentry.captureException(state.error);
      return;
    }
    const act = cfg.actions.find((a) => a.id === selectedActionId) as IAction | undefined; // narrow to IAction
    if (!act) {
      state.error = 'Invalid Action';
      Sentry.captureException(state.error);
      return;
    }
    if ('watch' in act) {
      if (action.payload) {
        act.watch = action.payload;
      } else {
        delete act.watch;
      }
    }
    cfg.updated = true;
  }
};
