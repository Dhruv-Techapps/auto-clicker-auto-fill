import { ConfigError, ISheets } from '@dhruv-techapps/core-common';
import { RANGE_REGEX } from './microsoft-excel.constant';
import { MicrosoftExcelService } from './microsoft-excel.service';
import { ValueRange } from './microsoft-excel.types';

export class MicrosoftExcelCS {
  transformWorkbook(workbook: Map<string, Set<string> | string>) {
    workbook.forEach((ranges, worksheetName) => {
      let lowestColumn = 'ZZ';
      let highestColumn = 'A';
      let lowestRow = 999;
      let hightestRow = 1;
      if (ranges instanceof Set) {
        ranges.forEach((range) => {
          const regexResult = RANGE_REGEX.exec(range);
          if (regexResult) {
            const [, column, row] = regexResult;
            const rowIndex = Number(row);
            // Highest Range
            if (highestColumn.length < column.length || highestColumn < column) {
              highestColumn = column;
            }
            if (hightestRow < rowIndex) {
              hightestRow = rowIndex;
            }
            // Lowest Range
            if (lowestColumn.length > column.length || lowestColumn > column) {
              lowestColumn = column;
            }
            if (lowestRow > rowIndex) {
              lowestRow = rowIndex;
            }
          }
        });
        workbook.set(worksheetName, `${lowestColumn}${lowestRow}:${highestColumn}${hightestRow}`);
      }
    });
  }

  transformResult(result: Array<ValueRange>): ISheets {
    return result.reduce((a: ISheets, c: ValueRange) => {
      const { range, values } = c;
      const [worksheetName, ranges] = range.split('!');
      const [startRange, endRange] = ranges.split(':');
      a[worksheetName] = { startRange, endRange, values };
      return a;
    }, {});
  }

  async getValues(workbook: Map<string, Set<string> | string>, workbookId?: string): Promise<ISheets | undefined> {
    try {
      if (workbook.size === 0) {
        return undefined;
      }
      if (workbookId) {
        this.transformWorkbook(workbook);
        const result = await MicrosoftExcelService.getWorkbook(
          workbookId,
          Array.from(workbook, ([worksheetName, range]) => `${worksheetName}!${range}`)
        );
        if (result) {
          return this.transformResult(result);
        }
        console.debug('Microsoft Excel', result);
        return result;
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'OAuth2 not granted or revoked.') {
        throw new ConfigError('Please connect to Microsoft Excel from global menu', 'Microsoft Excel');
      }
      console.warn('Microsoft Excel', error);
      throw error;
    }
    return undefined;
  }
}