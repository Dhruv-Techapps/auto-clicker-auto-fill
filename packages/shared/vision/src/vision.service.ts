import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';

import { VisionImageRequest } from './lib/vision-types';
import { RUNTIME_MESSAGE_VISION } from './lib/vision.constant';

export class VisionService extends CoreService {
  static override trace = true;
  static async imagesAnnotate(message: VisionImageRequest): Promise<string> {
    return await this.message<RuntimeMessageRequest<VisionImageRequest>, string>({
      messenger: RUNTIME_MESSAGE_VISION,
      methodName: 'imagesAnnotate',
      message: message
    });
  }
}
