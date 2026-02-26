import { IActionStatement } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';

export interface SyncActionStatementPayload {
  statement?: IActionStatement;
  actionId: TRandomUUID;
  configId: TRandomUUID;
}

export const actionStatementActions = {
  syncActionStatement: (state: ConfigStore, action: PayloadAction<SyncActionStatementPayload>) => {
    const { actionId, configId, statement } = action.payload;
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

    if (statement) {
      selectedAction.statement = statement;
    } else {
      delete selectedAction.statement;
    }
    selectedConfig.updated = true;
  }
};
