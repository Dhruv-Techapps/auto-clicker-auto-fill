import { IAddon } from '@dhruv-techapps/acf-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';

export const actionAddonActions = {
  syncActionAddon: (state: ConfigStore, action: PayloadAction<IAddon | undefined>) => {
    const { configs, selectedActionId, selectedConfigId } = state;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      console.error('addon.actions.syncActionAddon', { message: 'Invalid Configuration', selectedConfigId, selectedActionId });
      return;
    }
    const selectedAction = selectedConfig.actions.find((action) => action.id === selectedActionId);
    if (!selectedAction) {
      state.error = 'Invalid Action';
      console.error('addon.actions.syncActionAddon', { message: 'Invalid Action', selectedConfigId, selectedActionId });
      return;
    }

    if (action.payload) {
      selectedAction.addon = action.payload;
    } else {
      delete selectedAction.addon;
    }
    selectedConfig.updated = true;
  }
};
