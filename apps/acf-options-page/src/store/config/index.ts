import { actionReducers } from './action';
import { configReducer } from './config.slice';
import { configSettingsReducer } from './settings';

export * from './action';
export * from './batch';
export * from './config.api';
export * from './config.middleware';
export * from './config.slice';
export * from './schedule';
export * from './settings';
export * from './watch';

export const configReducers = {
  configuration: configReducer,
  configSettings: configSettingsReducer,
  ...actionReducers
};
