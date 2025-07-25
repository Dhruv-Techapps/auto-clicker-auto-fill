import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_GOOGLE_DRIVE } from './google-drive.constant';
import { IDriveFile } from './google-drive.types';

export class GoogleDriveService extends CoreService {
  static async listWithContent() {
    return await this.message<RuntimeMessageRequest<boolean>, Array<IDriveFile>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'listWithContent', message: true });
  }

  static async delete(id: string, name: string) {
    return await this.message<RuntimeMessageRequest<{ id: string; name: string }>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'delete', message: { id, name } });
  }

  static async autoBackup(autoBackup: string) {
    return await this.message<RuntimeMessageRequest<string>>({ messenger: RUNTIME_MESSAGE_GOOGLE_DRIVE, methodName: 'autoBackup', message: autoBackup });
  }
}
