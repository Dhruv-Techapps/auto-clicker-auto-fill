import { BATCH_REPEAT, IConfiguration, isAction, SESSION_COUNT } from '@dhruv-techapps/acf-common';
const MICROSOFT_EXCEL_REGEX = /^microsoftexcel::/i;

export default class MicrosoftExcel {
  static getWorkbook(config: IConfiguration) {
    const workbook = new Map<string, Set<string>>();
    const batchHighestRepeat: number = config.batch?.repeat ?? 0;
    config.actions
      .filter(isAction)
      .map(({ elementFinder, value, addon }) => {
        const result = [];
        if (value && MICROSOFT_EXCEL_REGEX.test(value)) {
          result.push(value.replace(MICROSOFT_EXCEL_REGEX, ''));
        }
        if (MICROSOFT_EXCEL_REGEX.test(elementFinder)) {
          result.push(elementFinder.replace(MICROSOFT_EXCEL_REGEX, ''));
        }
        if (addon) {
          if (MICROSOFT_EXCEL_REGEX.test(addon.value)) {
            result.push(addon.value.replace(MICROSOFT_EXCEL_REGEX, ''));
          }
          if (MICROSOFT_EXCEL_REGEX.test(addon.elementFinder)) {
            result.push(addon.elementFinder.replace(MICROSOFT_EXCEL_REGEX, ''));
          }
        }
        return result;
      })
      .filter((microsoftExcel) => microsoftExcel.length)
      .forEach((microsoftExcel) => {
        microsoftExcel.forEach((value) => {
          const [worksheetName, range] = value.split('!');
          const ranges = workbook.get(worksheetName) || new Set<string>();
          if (value.includes(BATCH_REPEAT)) {
            ranges.add(range.replace(BATCH_REPEAT, '1'));
            ranges.add(range.replace(BATCH_REPEAT, String(batchHighestRepeat + 1)));
          } else if (value.includes(SESSION_COUNT)) {
            ranges.add(range.replace(SESSION_COUNT, String(window.ext.__sessionCount)));
          } else {
            ranges.add(range);
          }
          workbook.set(worksheetName, ranges);
        });
      });
    return workbook;
  }
}