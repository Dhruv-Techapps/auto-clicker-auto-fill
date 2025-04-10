interface IAlarmsCreateReq {
  name: string;
  alarmInfo: chrome.alarms.AlarmCreateInfo;
}

export interface IAlarmsRequest {
  messenger: 'alarms';
  methodName: 'create' | 'clear' | 'clearAll' | 'get' | 'getAll';
  message?: string | IAlarmsCreateReq;
}

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
