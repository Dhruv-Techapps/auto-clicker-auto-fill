import { TBoundedValue } from './ICommon';

export interface IBatch {
  refresh?: boolean;
  repeat?: TBoundedValue;
  repeatInterval?: number;
  repeatIntervalTo?: number;
}

export const defaultBatch: IBatch = {};
