import { ActionSettings } from '@dhruv-techapps/acf-common';
import { PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import { ConfigStore } from '../../config.slice';

export const actionSettingsActions = {
  syncActionSettings: (state: ConfigStore, action: PayloadAction<ActionSettings | undefined>) => {
    const { configs, selectedActionId, selectedConfigId } = state;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      Sentry.captureException(state.error);
      return;
    }
    const selectedAction = selectedConfig.actions.find((action) => action.id === selectedActionId);
    if (!selectedAction) {
      state.error = 'Invalid Action';
      Sentry.captureException(state.error);
      return;
    }

    if (action.payload) {
      selectedAction.settings = action.payload;
    } else {
      delete selectedAction.settings;
    }
    selectedConfig.updated = true;
  }
};
