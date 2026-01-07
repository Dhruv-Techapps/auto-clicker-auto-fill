import { IActionSettings } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';

export const actionSettingsActions = {
  syncActionSettings: (state: ConfigStore, action: PayloadAction<IActionSettings | undefined>) => {
    const { configs, selectedActionId, selectedConfigId } = state;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      GoogleAnalyticsService.fireErrorEvent('syncActionSettings', 'Invalid Configuration');
      return;
    }
    const selectedAction = selectedConfig.actions.find((action) => action.id === selectedActionId);
    if (!selectedAction) {
      state.error = 'Invalid Action';
      GoogleAnalyticsService.fireErrorEvent('syncActionSettings', 'Invalid Action');

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
