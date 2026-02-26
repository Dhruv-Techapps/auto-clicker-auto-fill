import { IAddon } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';

export interface SyncActionAddonPayload {
  addon?: IAddon;
  actionId: TRandomUUID;
  configId: TRandomUUID;
}

export const actionAddonActions = {
  syncActionAddon: (state: ConfigStore, action: PayloadAction<SyncActionAddonPayload>) => {
    const { actionId, configId, addon } = action.payload;
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

    if (addon) {
      selectedAction.addon = addon;
    } else {
      delete selectedAction.addon;
    }
    selectedConfig.updated = true;
  }
};
