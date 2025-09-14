import { FirebaseFunctionsBackground } from '@dhruv-techapps/shared-firebase-functions';
import { MICROSOFT_SCOPES } from '@dhruv-techapps/shared-microsoft-oauth';
import { NotificationHandler } from '@dhruv-techapps/shared-notifications';
import { MicrosoftExcelRequest, MicrosoftExcelResponse } from './microsoft-excel.types';

const NOTIFICATIONS_TITLE = 'Microsoft Excel';
const NOTIFICATIONS_ID = 'microsoft-excel';

export class MicrosoftExcelBackground extends FirebaseFunctionsBackground {
  scopes = [MICROSOFT_SCOPES.EXCEL];
  async getWorkbook({ workbookId, ranges }: MicrosoftExcelRequest): Promise<MicrosoftExcelResponse> {
    if (!workbookId || !ranges) {
      throw new Error('workbookId or ranges is not defined');
    }

    const response = await this.getValues<MicrosoftExcelRequest, MicrosoftExcelResponse>({ workbookId, ranges });
    return response.filter((result) => {
      if (result.error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, result.error.message);
        return false;
      }
      return true;
    });
  }
}