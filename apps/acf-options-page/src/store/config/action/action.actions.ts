import { IAction, getDefaultAction, getDefaultUserscript } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
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

interface AddActionPayload { actionId?: TRandomUUID; position?: 1 | 0; configId: TRandomUUID }

export const actionActions = {
  reorderActions: (state: ConfigStore, action: PayloadAction<{ oldIndex: number; newIndex: number; configId: TRandomUUID }>) => {
    const { configs } = state;
    const { oldIndex, newIndex, configId } = action.payload;

    const selectedConfig = configs.find((config) => config.id === configId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';

      return;
    }
    // @ts-expect-error "making is generic function difficult for TypeScript"
    selectedConfig.actions = [...arrayMove(selectedConfig.actions, oldIndex, newIndex)];
  },
  addAction: (state: ConfigStore, action: PayloadAction<AddActionPayload>) => {
    const { configs } = state;
    const { configId } = action.payload;

    const selectedConfig = configs.find((config) => config.id === configId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';

      return;
    }
    if (action.payload?.actionId && action.payload?.position) {
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
    const { configs } = state;
    const { configId } = action.payload;
    const selectedConfig = configs.find((config) => config.id === configId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';

      return;
    }
    selectedConfig.actions.push(getDefaultUserscript());
    selectedConfig.updated = true;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAction: (state: ConfigStore, action: PayloadAction<{ actionId: TRandomUUID; name: string; value: any; configId: TRandomUUID }>) => {
    const { configs } = state;
    const { name, value, actionId, configId } = action.payload;

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
  removeAction: (state: ConfigStore, action: PayloadAction<{ actionId: TRandomUUID; configId: TRandomUUID }>) => {
    const { configs } = state;
    const { actionId, configId } = action.payload;

    const selectedConfig = configs.find((config) => config.id === configId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';

      return;
    }

    const selectedActionIndex = selectedConfig.actions.findIndex((action) => action.id === actionId);
    if (selectedActionIndex === -1) {
      state.error = 'Invalid Action';

      return;
    }

    selectedConfig.actions.splice(selectedActionIndex, 1);
    selectedConfig.updated = true;
  },
  ...actionAddonActions,
  ...actionSettingsActions,
  ...actionStatementActions
};
