import { actionReducers } from './action';
import { batchReducer } from './batch';
import { configReducer } from './config.slice';
import { configRemoveReducer } from './remove';
import { configReorderReducer } from './reorder';
import { scheduleReducer } from './schedule';
import { configSettingsReducer } from './settings';

export * from './action';
export * from './batch';
export * from './remove';
export * from './reorder';
export * from './settings';
export * from './config.slice';
export * from './config.middleware';
export * from './schedule';

export const configReducers = {
  configuration: configReducer,
  configRemove: configRemoveReducer,
  configReorder: configReorderReducer,
  configSettings: configSettingsReducer,
  schedule: scheduleReducer,
  batch: batchReducer,
  ...actionReducers
};
