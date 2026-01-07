import { CONFIGURATIONS } from '@acf-options-page/data/configurations';
import { EConfigSource, EStartTypes, IConfiguration, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics/service';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { LocalStorage } from '../../_helpers';
import { RootState } from '../store';
import { actionActions, openActionAddonModalAPI, openActionSettingsModalAPI, openActionStatementModalAPI } from './action';
import { batchActions } from './batch';
import { configGetAllAPI } from './config.api';
import { getConfigName, updateConfigId, updateConfigIds } from './config.slice.util';
import { scheduleActions } from './schedule';
import { openWatchModalAPI, watchActions } from './watch';

const HIDDEN_DETAIL_KEY = 'config-detail-visibility';
const defaultDetailVisibility = { name: true, url: true };

export interface ConfigStore {
  loading: boolean;
  selectedConfigId: TRandomUUID;
  selectedActionId: TRandomUUID;
  error?: string;
  configs: Array<IConfiguration>;
  message?: string;
  search?: string;
  detailVisibility: { name: boolean; url: boolean };
}

interface ConfigAction {
  name: string;
  value: any;
}

const initialState: ConfigStore = {
  loading: true,
  configs: CONFIGURATIONS,
  selectedConfigId: CONFIGURATIONS[0].id,
  selectedActionId: CONFIGURATIONS[0].actions[0].id,
  detailVisibility: LocalStorage.getItem(HIDDEN_DETAIL_KEY, defaultDetailVisibility)
};

const slice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    setConfigError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      GoogleAnalyticsService.fireErrorEvent('Configuration Store', state.error || 'Unknown Error');
      state.message = undefined;
    },
    setConfigMessage: (state, action: PayloadAction<string | undefined>) => {
      state.message = action.payload;
      state.error = undefined;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    addConfig: {
      reducer: (state, action: PayloadAction<IConfiguration>) => {
        state.configs.unshift(action.payload);
        state.selectedConfigId = action.payload.id;
      },
      prepare: () => {
        const config = getDefaultConfig(EConfigSource.WEB);
        return { payload: config };
      }
    },
    updateConfig: (state, action: PayloadAction<ConfigAction>) => {
      const { name, value } = action.payload;
      const { configs, selectedConfigId } = state;

      const selectedConfig = configs.find((config) => config.id === selectedConfigId);
      if (!selectedConfig) {
        state.error = 'Invalid Configuration';
        GoogleAnalyticsService.fireErrorEvent('updateConfig', state.error);
        return;
      }
      // @ts-expect-error "making is generic function difficult for TypeScript"
      selectedConfig[name] = value;
      selectedConfig['updated'] = true;
      if (name === 'url' && !selectedConfig.name) {
        selectedConfig.name = getConfigName(value);
      }
    },
    updateConfigSettings: (state, action: PayloadAction<ConfigAction>) => {
      const { name, value } = action.payload;
      const { configs, selectedConfigId } = state;

      const selectedConfig = configs.find((config) => config.id === selectedConfigId);
      if (!selectedConfig) {
        state.error = 'Invalid Configuration';
        GoogleAnalyticsService.fireErrorEvent('updateConfigSettings', state.error);
        return;
      }
      // @ts-expect-error "making is generic function difficult for TypeScript"
      selectedConfig[name] = value;
      selectedConfig['updated'] = true;
      if (name === 'startType' && value === EStartTypes.AUTO) {
        delete selectedConfig.hotkey;
      }
    },
    removeConfig: (state, action: PayloadAction<TRandomUUID>) => {
      const { configs } = state;
      const selectConfigIndex = configs.findIndex((config) => config.id === action.payload);
      if (selectConfigIndex === -1) {
        state.error = 'Invalid Configuration';
        GoogleAnalyticsService.fireErrorEvent('removeConfig', state.error);
        return;
      }
      configs.splice(selectConfigIndex, 1);
      if (configs.length !== 0) {
        state.selectedConfigId = configs[0].id;
      }
    },
    setConfigs: (state, action: PayloadAction<Array<IConfiguration>>) => {
      state.configs = updateConfigIds(action.payload);
      state.selectedConfigId = state.configs[0].id;
    },
    importAll: (state, action: PayloadAction<Array<IConfiguration>>) => {
      state.configs.push(...updateConfigIds(action.payload));
      state.selectedConfigId = state.configs[0].id;
    },
    importConfig: (state, action: PayloadAction<IConfiguration>) => {
      const config = updateConfigId(action.payload);
      state.configs.push(config);
      state.selectedConfigId = config.id;
    },
    duplicateConfig: (state) => {
      const { configs, selectedConfigId } = state;
      const id = crypto.randomUUID();
      const selectedConfig = configs.find((config) => config.id === selectedConfigId);
      if (!selectedConfig) {
        state.error = 'Invalid Configuration';
        GoogleAnalyticsService.fireErrorEvent('duplicateConfig', state.error);
        return;
      }
      const name = '(Duplicate) ' + (selectedConfig.name || selectedConfig.url || 'Configuration');
      const actions = selectedConfig.actions.map((action) => ({ ...action, id: crypto.randomUUID() }));
      state.configs.push({ ...selectedConfig, name, id, actions });
      state.selectedConfigId = id;
    },
    selectConfig: (state, action: PayloadAction<TRandomUUID>) => {
      state.selectedConfigId = action.payload;
    },
    setDetailVisibility: (state, action: PayloadAction<string>) => {
      // @ts-expect-error "making is generic function difficult for TypeScript"
      state.detailVisibility[action.payload] = !state.detailVisibility[action.payload];
      LocalStorage.setItem(HIDDEN_DETAIL_KEY, state.detailVisibility);
    },
    ...actionActions,
    ...batchActions,
    ...watchActions,
    ...scheduleActions
  },
  extraReducers: (builder) => {
    builder.addCase(configGetAllAPI.fulfilled, (state, action) => {
      if (action.payload) {
        const { configurations, selectedConfigId } = action.payload;
        if (configurations.length !== 0) {
          state.configs = configurations;
          state.selectedConfigId = selectedConfigId || configurations[0].id;
        }
      }
      state.loading = false;
    });
    builder.addCase(configGetAllAPI.rejected, (state, action) => {
      state.error = action.error.message;
      GoogleAnalyticsService.fireErrorEvent('Configuration Store', state.error || 'Unknown Error');
      state.loading = false;
    });
    builder.addCase(openActionAddonModalAPI.fulfilled, (state, action) => {
      state.selectedActionId = action.payload.selectedActionId;
    });
    builder.addCase(openActionAddonModalAPI.rejected, (state, action) => {
      state.error = action.error.message;
      GoogleAnalyticsService.fireErrorEvent('Configuration Store', state.error || 'Unknown Error');
    });
    builder.addCase(openActionSettingsModalAPI.fulfilled, (state, action) => {
      state.selectedActionId = action.payload.selectedActionId;
    });
    builder.addCase(openActionSettingsModalAPI.rejected, (state, action) => {
      state.error = action.error.message;
      GoogleAnalyticsService.fireErrorEvent('Configuration Store', state.error || 'Unknown Error');
    });
    builder.addCase(openWatchModalAPI.rejected, (state, action) => {
      state.error = action.error.message;
      GoogleAnalyticsService.fireErrorEvent('Configuration Store', state.error || 'Unknown Error');
    });
    builder.addCase(openActionStatementModalAPI.fulfilled, (state, action) => {
      state.selectedActionId = action.payload.selectedActionId;
    });
    builder.addCase(openActionStatementModalAPI.rejected, (state, action) => {
      state.error = action.error.message;
      GoogleAnalyticsService.fireErrorEvent('Configuration Store', state.error || 'Unknown Error');
    });
  }
});

export const {
  setConfigMessage,
  setConfigError,
  addConfig,
  setConfigs,
  selectConfig,
  updateConfig,
  updateConfigSettings,
  removeConfig,
  duplicateConfig,
  importAll,
  importConfig,
  updateBatch,
  addAction,
  addUserscript,
  reorderActions,
  removeAction,
  updateAction,
  syncActionAddon,
  syncActionSettings,
  syncActionStatement,
  syncSchedule,
  syncWatch,
  setSearch,
  setDetailVisibility
} = slice.actions;

//Config Selectors
export const configSelector = (state: RootState) => state.configuration;

const searchSelector = (state: RootState) => state.configuration.search;
export const filteredConfigsSelector = createSelector(
  (state: RootState) => state.configuration.configs,
  searchSelector,
  (configs, search) => {
    return configs.filter((config) => {
      if (!search) {
        return true;
      }
      const name = config.name ? config.name.toLowerCase() : '';
      const url = config.url ? config.url.toLowerCase() : '';
      return name.includes(search.toLowerCase()) || url.includes(search.toLowerCase());
    });
  }
);
const selectedConfigIdSelector = (state: RootState) => state.configuration.selectedConfigId;
const selectedActionIdSelector = (state: RootState) => state.configuration.selectedActionId;

export const selectedConfigSelector = createSelector(filteredConfigsSelector, selectedConfigIdSelector, (configs, selectedConfigId) => configs.find((config) => config.id === selectedConfigId));

//Action Selectors
export const selectedActionSelector = createSelector(selectedConfigSelector, selectedActionIdSelector, (config, selectedActionId) => config?.actions.find((action) => action.id === selectedActionId));

//Action Settings Selectors
export const selectedActionSettingsSelector = createSelector(selectedActionSelector, (action) => action?.settings);

//Action Statement Selectors
export const selectedActionStatementSelector = createSelector(selectedActionSelector, (action) => action?.statement);

// Action Addon Selectors
export const selectedActionAddonSelector = createSelector(selectedActionSelector, (action) => action?.addon);

// Action Statement Conditions Selectors
export const selectedActionStatementConditionsSelector = createSelector(selectedActionSelector, (action) => action?.statement?.conditions);

export const configReducer = slice.reducer;
