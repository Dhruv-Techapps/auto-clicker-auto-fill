/* eslint-disable @typescript-eslint/no-explicit-any */
enum Dimension {
  ROWS,
  COLUMNS
}

export interface ValueRange {
  range: string;
  majorDimension: Dimension;
  values: Array<any>;
  error?: { message: string };
}

export interface MicrosoftExcelRequest {
  workbookId: string;
  ranges: Array<string>;
}

export type MicrosoftExcelResponse = Array<ValueRange>;