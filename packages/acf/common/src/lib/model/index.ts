import { IAction } from './IAction';
import { IUserScript } from './IUserscript';

export * from './IAction';
export * from './IAddon';
export * from './IBatch';
export * from './IConfiguration';
export * from './ISetting';
export * from './IUserscript';
export * from './TGoto';
export const BATCH_REPEAT = '<batchRepeat>';
export const ACTION_REPEAT = '<actionRepeat>';
export const SESSION_COUNT = '<sessionCount>';

// Add this helper function to check if action is IUserScript
export const isUserScript = (action: IAction | IUserScript): action is IUserScript => {
  // Check for properties that are unique to IUserScript
  // Based on common patterns, IUserScript likely has different properties than IAction
  return 'type' in action && action.type === 'userscript';
};

export const isAction = (action: IAction | IUserScript): action is IAction => {
  // Check for properties that are unique to IAction
  return 'elementFinder' in action && typeof action.elementFinder === 'string';
};
