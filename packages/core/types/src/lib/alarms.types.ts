export interface IAlarmsCreateReq {
  name: string;
  alarmInfo: chrome.alarms.AlarmCreateInfo;
}

export interface IAlarmsRequest {
  messenger: 'alarms';
  methodName: 'create' | 'clear' | 'clearAll' | 'get' | 'getAll';
  message?: string | IAlarmsCreateReq;
}
