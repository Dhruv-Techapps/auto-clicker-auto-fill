import { IAction, getDefaultAction, getDefaultUserscript } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../config.slice';
import { actionAddonActions } from './addon';
import { actionSettingsActions } from './settings';
import { actionStatementActions } from './statement';

const arrayMove = (arr: Array<IAction | undefined>, oldIndex: number, newIndex: number) => {
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

type AddActionPayload = undefined | { actionId: TRandomUUID; position: 1 | 0 };

export const actionActions = {
  reorderActions: (state: ConfigStore, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
    const { configs, selectedConfigId } = state;
    const { oldIndex, newIndex } = action.payload;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      GoogleAnalyticsService.fireErrorEvent('reorderActions', state.error);
      return;
    }
    // @ts-expect-error "making is generic function difficult for TypeScript"
    selectedConfig.actions = [...arrayMove(selectedConfig.actions, oldIndex, newIndex)];
  },
  addAction: (state: ConfigStore, action: PayloadAction<AddActionPayload>) => {
    const { configs, selectedConfigId } = state;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      GoogleAnalyticsService.fireErrorEvent('addAction', state.error);
      return;
    }
    if (action.payload?.actionId) {
      const { actionId, position } = action.payload;
      const index = selectedConfig.actions.findIndex((action) => action.id === actionId);
      if (index !== -1) {
        selectedConfig.actions.splice(index + position, 0, getDefaultAction());
      }
    } else {
      selectedConfig.actions.push(getDefaultAction());
    }
    selectedConfig.updated = true;
  },
  addUserscript: (state: ConfigStore, action: PayloadAction<AddActionPayload>) => {
    const { configs, selectedConfigId } = state;
    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      GoogleAnalyticsService.fireErrorEvent('addUserscript', state.error);
      return;
    }
    selectedConfig.actions.push(getDefaultUserscript());
    selectedConfig.updated = true;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAction: (state: ConfigStore, action: PayloadAction<{ selectedActionId: TRandomUUID; name: string; value: any }>) => {
    const { configs, selectedConfigId } = state;
    const { name, value, selectedActionId } = action.payload;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      GoogleAnalyticsService.fireErrorEvent('updateAction', state.error);
      return;
    }

    const selectedAction = selectedConfig.actions.find((action) => action.id === selectedActionId);
    if (!selectedAction) {
      state.error = 'Invalid Action';
      GoogleAnalyticsService.fireErrorEvent('updateAction', state.error);
      return;
    }
    // @ts-expect-error "making is generic function difficult for TypeScript"
    selectedAction[name] = value;
    const { error } = selectedAction;
    if (error) {
      const index = error.indexOf(name);
      if (index > -1) {
        error.splice(index, 1);
      }
    }
    selectedConfig.updated = true;
  },
  removeAction: (state: ConfigStore, action: PayloadAction<TRandomUUID>) => {
    const { configs, selectedConfigId } = state;
    const selectedActionId = action.payload;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      GoogleAnalyticsService.fireErrorEvent('removeAction', state.error);
      return;
    }

    const selectedActionIndex = selectedConfig.actions.findIndex((action) => action.id === selectedActionId);
    if (selectedActionIndex === -1) {
      state.error = 'Invalid Action';
      GoogleAnalyticsService.fireErrorEvent('removeAction', state.error);
      return;
    }

    selectedConfig.actions.splice(selectedActionIndex, 1);
    selectedConfig.updated = true;
  },
  ...actionAddonActions,
  ...actionSettingsActions,
  ...actionStatementActions
};
