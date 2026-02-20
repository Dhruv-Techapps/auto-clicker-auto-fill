import { actionReducers } from './action';
import { configReducer } from './config.slice';
import { configRemoveReducer } from './remove';
import { configReorderReducer } from './reorder';
import { configSettingsReducer } from './settings';

export * from './action';
export * from './batch';
export * from './config.middleware';
export * from './config.slice';
export * from './remove';
export * from './reorder';
export * from './schedule';
export * from './settings';
export * from './watch';

export const configReducers = {
  configuration: configReducer,
  configRemove: configRemoveReducer,
  configReorder: configReorderReducer,
  configSettings: configSettingsReducer,
  ...actionReducers
};
