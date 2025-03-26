import { ISchedule, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { CoreService } from '@dhruv-techapps/core-service';

export class ScheduleService extends CoreService {
  static async create(id: string, schedule: ISchedule) {
    return await this.message({ messenger: RUNTIME_MESSAGE_ACF.ACF_CONFIG_SCHEDULE, methodName: 'create', message: { id, schedule } });
  }

  static async clear(id: string) {
    return await this.message({ messenger: RUNTIME_MESSAGE_ACF.ACF_CONFIG_SCHEDULE, methodName: 'clear', message: id });
  }
}
