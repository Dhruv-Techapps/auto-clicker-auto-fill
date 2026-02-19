import { CONFIGURATIONS } from '@acf-options-page/data/configurations';
import { EConfigSource, EStartTypes, IConfiguration, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
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
  selectedActionId: TRandomUUID;
  error?: string;
  configs: Array<IConfiguration>;
  message?: string;
  search?: string;
  detailVisibility: { name: boolean; url: boolean };
}

interface ConfigAction {
  selectedConfigId: TRandomUUID;
  name: string;
  value: any;
}

const initialState: ConfigStore = {
  loading: true,
  configs: CONFIGURATIONS,
  selectedActionId: CONFIGURATIONS[0].actions[0].id,
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
    updateConfig: (state, action: PayloadAction<ConfigAction>) => {
      const { name, value, selectedConfigId } = action.payload;
      const { configs } = state;

      const selectedConfig = configs.find((config) => config.id === selectedConfigId);
      if (!selectedConfig) {
        state.error = 'Invalid Configuration';

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
      const { name, value, selectedConfigId } = action.payload;
      const { configs } = state;

      const selectedConfig = configs.find((config) => config.id === selectedConfigId);
      if (!selectedConfig) {
        state.error = 'Invalid Configuration';

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

        return;
      }
      configs.splice(selectConfigIndex, 1);
    },
    setConfigs: (state, action: PayloadAction<Array<IConfiguration>>) => {
      state.configs = updateConfigIds(action.payload);
    },
    importAll: (state, action: PayloadAction<Array<IConfiguration>>) => {
      state.configs.push(...updateConfigIds(action.payload));
    },
    importConfig: (state, action: PayloadAction<IConfiguration>) => {
      const config = updateConfigId(action.payload);
      state.configs.push(config);
    },
    duplicateConfig: (state, action: PayloadAction<TRandomUUID>) => {
      const selectedConfigId = action.payload;
      const { configs } = state;
      const id = crypto.randomUUID();
      const selectedConfig = configs.find((config) => config.id === selectedConfigId);
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
    builder.addCase(openActionAddonModalAPI.fulfilled, (state, action) => {
      state.selectedActionId = action.payload.selectedActionId;
    });
    builder.addCase(openActionAddonModalAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(openActionSettingsModalAPI.fulfilled, (state, action) => {
      state.selectedActionId = action.payload.selectedActionId;
    });
    builder.addCase(openActionSettingsModalAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(openWatchModalAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(openActionStatementModalAPI.fulfilled, (state, action) => {
      state.selectedActionId = action.payload.selectedActionId;
    });
    builder.addCase(openActionStatementModalAPI.rejected, (state, action) => {
      state.error = action.error.message;
    });
  }
});

export const {
  setConfigMessage,
  setConfigError,
  addConfig,
  setConfigs,
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

export const configReducer = slice.reducer;
