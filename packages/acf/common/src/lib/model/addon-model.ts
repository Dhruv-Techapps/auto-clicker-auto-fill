import { TGoto } from './common-model';

export enum EAddonConditions {
  '~~ Select Condition ~~' = '',
  '= Equals' = 'Equals',
  '!= Not Equals' = 'NotEquals',
  '~ Contains' = 'Contains',
  '!~ Not Contains' = 'NotContains',
  '> Greater Than' = 'GreaterThan',
  '< Less Than' = 'LessThan',
  '>= Greater Than Equals' = 'GreaterThanEquals',
  '<= Less Than Equals' = 'LessThanEquals',
  '✓ Is Checked ' = 'IsChecked',
  '✕ Is Not Checked ' = 'IsNotChecked'
}

export enum ERecheckOptions {
  STOP = 'stop',
  SKIP = 'skip',
  RELOAD = 'reload',
  GOTO = 'goto'
}

export interface IAddon {
  elementFinder: string;
  value: string;
  condition: EAddonConditions;
  valueExtractor?: string;
  valueExtractorFlags?: string;
  recheck?: number;
  recheckInterval?: number | string;
  recheckOption: ERecheckOptions;
  recheckGoto?: TGoto;
}

export const defaultAddon: IAddon = {
  elementFinder: '',
  value: '',
  condition: EAddonConditions['~~ Select Condition ~~'],
  recheckOption: ERecheckOptions.STOP
};
