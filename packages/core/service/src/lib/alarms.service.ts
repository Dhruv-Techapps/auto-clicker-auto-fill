import { IAlarmsRequest } from '@dhruv-techapps/core-extension';
import { CoreService } from './service';

export class AlarmsService extends CoreService {
  static async create(name: string, alarmInfo: chrome.alarms.AlarmCreateInfo) {
    return await this.message<IAlarmsRequest>({ messenger: 'alarms', methodName: 'create', message: { name, alarmInfo } });
  }

  static async clear(name: string) {
    return await this.message<IAlarmsRequest>({ messenger: 'alarms', methodName: 'clear', message: name });
  }

  static async get(name: string) {
    return await this.message<IAlarmsRequest>({ messenger: 'alarms', methodName: 'get', message: name });
  }

  static async clearAll() {
    return await this.message<IAlarmsRequest>({ messenger: 'alarms', methodName: 'clearAll' });
  }

  static async getAll() {
    return await this.message<IAlarmsRequest>({ messenger: 'alarms', methodName: 'getAll' });
  }
}
