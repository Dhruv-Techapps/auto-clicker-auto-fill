import { IActionSettings } from '@dhruv-techapps/acf-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';

export interface SyncActionSettingsPayload {
  settings?: IActionSettings;
  actionId: string;
  configId: string;
}

export const actionSettingsActions = {
  syncActionSettings: (state: ConfigStore, action: PayloadAction<SyncActionSettingsPayload>) => {
    const { settings, actionId, configId } = action.payload;
    const { configs } = state;

    const selectedConfig = configs.find((config) => config.id === configId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';

      return;
    }
    const selectedAction = selectedConfig.actions.find((action) => action.id === actionId);
    if (!selectedAction) {
      state.error = 'Invalid Action';

      return;
    }

    if (settings) {
      selectedAction.settings = settings;
    } else {
      delete selectedAction.settings;
    }
    selectedConfig.updated = true;
  }
};
