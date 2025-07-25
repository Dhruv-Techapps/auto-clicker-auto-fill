import { actionReducer } from './action.slice';
import { actionAddonReducer } from './addon';
import { actionSettingsReducer } from './settings';
import { actionStatementReducer } from './statement';

export * from './action.actions';
export * from './action.slice';
export * from './addon';
export * from './settings';
export * from './statement';

export const actionReducers = {
  action: actionReducer,
  actionAddon: actionAddonReducer,
  actionStatement: actionStatementReducer,
  actionSettings: actionSettingsReducer
};
