import { CONFIGURATIONS } from '@acf-options-page/data/configurations';
import { EConfigSource, IConfiguration, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LocalStorage } from '../../_helpers';
import { RootState } from '../store';
import { actionActions } from './action';
import { batchActions } from './batch';
import { configGetAllAPI } from './config.api';
import { updateConfigIds } from './config.slice.util';
import { scheduleActions } from './schedule';
import { watchActions } from './watch';

const HIDDEN_DETAIL_KEY = 'config-detail-visibility';
const defaultDetailVisibility = { name: true, url: true };

export interface ConfigStore {
  loading: boolean;
  error?: string;
  configs: Array<IConfiguration>;
  message?: string;
  search?: string;
  detailVisibility: { name: boolean; url: boolean };
}

type ConfigSettingsAction = { configId: TRandomUUID } & Partial<Omit<IConfiguration, 'id' | 'configId' | 'actions'>>;

const initialState: ConfigStore = {
  loading: true,
  configs: CONFIGURATIONS,
  detailVisibility: LocalStorage.getItem(HIDDEN_DETAIL_KEY, defaultDetailVisibility)
};

const slice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    setConfigError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
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
      },
      prepare: () => {
        const config = getDefaultConfig(EConfigSource.WEB);
        return { payload: config };
      }
    },
    updateConfig: (state, action: PayloadAction<ConfigSettingsAction>) => {
      const { configId, ...settings } = action.payload;
      const { configs } = state;
      const selectedConfig = configs.find((config) => config.id === configId);
      if (!selectedConfig) {
        state.error = 'Invalid Configuration';
        return;
      }
      Object.assign(selectedConfig, settings);
      selectedConfig.updated = true;
    },
    removeConfigs: (state, action: PayloadAction<Array<TRandomUUID>>) => {
      const selectedConfigs = action.payload;
      const { configs } = state;
      const remainingConfigs = configs.filter((config) => !selectedConfigs.includes(config.id));
      state.configs = remainingConfigs;
    },
    setConfigs: (state, action: PayloadAction<Array<IConfiguration>>) => {
      state.configs = updateConfigIds(action.payload);
    },
    importConfigs: (state, action: PayloadAction<Array<IConfiguration>>) => {
      state.configs.push(...updateConfigIds(action.payload));
    },
    duplicateConfig: (state, action: PayloadAction<TRandomUUID>) => {
      const configId = action.payload;
      const { configs } = state;
      const id = crypto.randomUUID();
      const selectedConfig = configs.find((config) => config.id === configId);
      if (!selectedConfig) {
        state.error = 'Invalid Configuration';
        return;
      }
      const name = '(Duplicate) ' + (selectedConfig.name || selectedConfig.url || 'Configuration');
      const actions = selectedConfig.actions.map((action) => ({ ...action, id: crypto.randomUUID() }));
      state.configs.push({ ...selectedConfig, name, id, actions });
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
        const { configurations } = action.payload;
        if (configurations.length !== 0) {
          state.configs = configurations;
        }
      }
      state.loading = false;
    });
    builder.addCase(configGetAllAPI.rejected, (state, action) => {
      state.error = action.error.message;

      state.loading = false;
    });
  }
});

export const {
  setConfigMessage,
  setConfigError,
  addConfig,
  setConfigs,
  updateConfig,
  removeConfigs,
  duplicateConfig,
  importConfigs,
  syncBatch,
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

export const configReducer = slice.reducer;

export const configByIdSelector = (state: RootState, configId: TRandomUUID) => state.configuration.configs.find((config) => config.id === configId);

export const actionByIdSelector = (state: RootState, configId: TRandomUUID, actionId: TRandomUUID) => {
  const config = state.configuration.configs.find((config) => config.id === configId);
  if (!config) {
    return undefined;
  }
  return config.actions.find((action) => action.id === actionId);
};
