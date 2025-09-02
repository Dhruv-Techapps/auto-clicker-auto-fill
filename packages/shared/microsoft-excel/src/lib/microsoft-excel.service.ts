import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_MICROSOFT_EXCEL } from './microsoft-excel.constant';
import { MicrosoftExcelRequest, MicrosoftExcelResponse } from './microsoft-excel.types';

export class MicrosoftExcelService extends CoreService {
  static async getWorkbook(workbookId: string, ranges: Array<string>) {
    return await this.message<RuntimeMessageRequest<MicrosoftExcelRequest>, MicrosoftExcelResponse>({
      messenger: RUNTIME_MESSAGE_MICROSOFT_EXCEL,
      methodName: 'getWorkbook',
      message: { workbookId, ranges }
    });
  }
}