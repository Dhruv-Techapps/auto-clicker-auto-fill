import { EErrorOptions, TGoto } from './ICommon';

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

export interface IAddon {
  elementFinder: string;
  value: string;
  condition: EAddonConditions;
  valueExtractor?: string;
  valueExtractorFlags?: string;
  recheck?: number;
  recheckInterval?: number | string;
  recheckOption: EErrorOptions;
  recheckGoto?: TGoto;
}

export const defaultAddon: IAddon = {
  elementFinder: '',
  value: '',
  condition: EAddonConditions['~~ Select Condition ~~'],
  recheckOption: EErrorOptions.STOP
};
