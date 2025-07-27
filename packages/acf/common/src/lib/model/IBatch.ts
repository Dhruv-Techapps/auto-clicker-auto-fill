export interface IBatch {
  refresh?: boolean;
  repeat?: number;
  repeatInterval?: number | string;
}

export const defaultBatch: IBatch = {};
