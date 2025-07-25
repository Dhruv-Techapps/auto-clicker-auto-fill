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

export interface Sheets {
  [index: string]: {
    startRange: string;
    endRange: string;
    values: Array<any>;
  };
}

export interface GoogleSheetsRequest {
  spreadsheetId: string;
  ranges: Array<string>;
}

export type GoogleSheetsResponse = Array<ValueRange>;
