import { PayloadAction } from '@reduxjs/toolkit';
import { RANDOM_UUID, getDefaultAction } from '@dhruv-techapps/acf-common';
import { ConfigStore } from '../config.slice';
import { actionAddonActions } from './addon';
import { actionSettingsActions } from './settings';
import { actionStatementActions } from './statement';

const arrayMove = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    k -= 1;
    while (k) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr; // for testing
};

export const actionActions = {
  reorderActions: (state: ConfigStore, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
    const { configs, selectedConfigId } = state;
    const { oldIndex, newIndex } = action.payload;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      return;
    }
    selectedConfig.actions = [...arrayMove(selectedConfig.actions, oldIndex, newIndex)];
  },
  addAction: (state: ConfigStore) => {
    const { configs, selectedConfigId } = state;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      return;
    }
    selectedConfig.actions.push(getDefaultAction());
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAction: (state: ConfigStore, action: PayloadAction<{ selectedActionId: RANDOM_UUID; name: string; value: any }>) => {
    const { configs, selectedConfigId } = state;
    const { name, value, selectedActionId } = action.payload;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      return;
    }

    const selectedAction = selectedConfig.actions.find((action) => action.id === selectedActionId);
    if (!selectedAction) {
      state.error = 'Invalid Action';
      return;
    }

    selectedAction[name] = value;
    const { error } = selectedAction;
    if (error) {
      const index = error.indexOf(name);
      if (index > -1) {
        error.splice(index, 1);
      }
    }
  },
  removeAction: (state: ConfigStore, action: PayloadAction<RANDOM_UUID>) => {
    const { configs, selectedConfigId } = state;
    const selectedActionId = action.payload;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      return;
    }

    const selectedActionIndex = selectedConfig.actions.findIndex((action) => action.id === selectedActionId);
    if (selectedActionIndex === -1) {
      state.error = 'Invalid Action';
      return;
    }

    selectedConfig.actions.splice(selectedActionIndex, 1);
  },
  ...actionAddonActions,
  ...actionSettingsActions,
  ...actionStatementActions,
};
