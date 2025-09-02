import { ConfigError, IExtension } from '@dhruv-techapps/core-common';
import { RANGE_REGEX } from './microsoft-excel.constant';

declare global {
  interface Window {
    ext: IExtension;
  }
}

export class MicrosoftExcelValue {
  static getWorkbookValue(value: string) {
    const workbook = window.ext.__workbook;
    if (!workbook) {
      return value;
    }
    const [worksheetName, range] = value.split('::')[1].split('!');
    if (!workbook?.[worksheetName]) {
      throw new ConfigError(`Worksheet: "${worksheetName}" not found!`, 'Worksheet not found');
    }
    const { startRange, values } = workbook[worksheetName];
    if (!values) {
      throw new ConfigError(`Worksheet "${worksheetName}" do not have value in ${startRange}`, 'Worksheet values not found');
    }

    if (!RANGE_REGEX.test(range)) {
      throw new ConfigError(`Worksheet range is not valid${range}`, 'Worksheet range invalid');
    }
    const currentRANGE_REGEXp = RANGE_REGEX.exec(range);
    if (currentRANGE_REGEXp) {
      const [, column, row] = currentRANGE_REGEXp;
      const startRANGE_REGEXp = RANGE_REGEX.exec(startRange);
      if (startRANGE_REGEXp) {
        const [, startColumn, startRow] = startRANGE_REGEXp;
        const columnIndex = this.columnToIndex(column) - this.columnToIndex(startColumn);
        const rowIndex = Number(row) - Number(startRow);
        if (values[rowIndex] && values[rowIndex][columnIndex] !== undefined) {
          return values[rowIndex][columnIndex];
        }
      }
    }
    throw new ConfigError(`Worksheet "${worksheetName}" do not have value in ${range}`, 'Worksheet value not found');
  }

  private static columnToIndex(column: string): number {
    let result = 0;
    for (let i = 0; i < column.length; i++) {
      result = result * 26 + (column.charCodeAt(i) - 64);
    }
    return result;
  }
}