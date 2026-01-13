import { IAlarmsCreateReq } from '@dhruv-techapps/core-types';

export class AlarmsMessenger {
  create({ name, alarmInfo }: IAlarmsCreateReq) {
    return chrome.alarms.create(name, alarmInfo);
  }
  clear(name: string) {
    return chrome.alarms.clear(name);
  }
  clearAll() {
    return chrome.alarms.clearAll();
  }
  get(name: string) {
    return chrome.alarms.get(name);
  }
  getAll() {
    return chrome.alarms.getAll();
  }
}
