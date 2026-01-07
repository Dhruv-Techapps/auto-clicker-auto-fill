import { IActionStatement } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { PayloadAction } from '@reduxjs/toolkit';
import { ConfigStore } from '../../config.slice';

export const actionStatementActions = {
  syncActionStatement: (state: ConfigStore, action: PayloadAction<IActionStatement | undefined>) => {
    const { configs, selectedActionId, selectedConfigId } = state;

    const selectedConfig = configs.find((config) => config.id === selectedConfigId);
    if (!selectedConfig) {
      state.error = 'Invalid Configuration';
      GoogleAnalyticsService.fireErrorEvent('syncActionStatement', 'Invalid Configuration');
      return;
    }
    const selectedAction = selectedConfig.actions.find((action) => action.id === selectedActionId);
    if (!selectedAction) {
      state.error = 'Invalid Action';
      GoogleAnalyticsService.fireErrorEvent('syncActionStatement', 'Invalid Action');
      return;
    }

    if (action.payload) {
      selectedAction.statement = action.payload;
    } else {
      delete selectedAction.statement;
    }
    selectedConfig.updated = true;
  }
};
