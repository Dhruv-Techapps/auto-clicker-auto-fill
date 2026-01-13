import { IBypass } from '@dhruv-techapps/acf-common';
import { CoreService } from '@dhruv-techapps/core-service';
import { RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING } from './lib/main-world.constant';

export class MainWorldService extends CoreService {
  static override trace = true;
  static async click(elementFinder: string) {
    return await this.message({ messenger: RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING, methodName: 'click', message: elementFinder });
  }

  static async bypass(message: IBypass) {
    return await this.message({ messenger: RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING, methodName: 'bypass', message });
  }
}
