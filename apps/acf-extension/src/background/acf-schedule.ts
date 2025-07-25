import { IConfiguration, ISchedule, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { auth } from './firebase';

interface IAlarmSchedule {
  schedule: ISchedule;
  id: TRandomUUID;
}

const CONFIG_ALARM_PREFIX = 'config-alarm-';

const getConfigs = async () => {
  const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
  const configs: Array<IConfiguration> = storageResult[LOCAL_STORAGE_KEY.CONFIGS] || [];
  return configs;
};

export class AcfSchedule {
  async check() {
    const schedules: Array<IAlarmSchedule> = (await getConfigs()).filter((config) => config.schedule).map((config) => ({ id: config.id, schedule: config.schedule }) as IAlarmSchedule);
    for (const schedule of schedules) {
      const alarm = await chrome.alarms.get(schedule.id);
      if (!alarm) {
        this.create(schedule);
      }
    }
  }

  async create(schedule: IAlarmSchedule) {
    const { date, time, repeat } = schedule.schedule;
    const when = new Date(`${date}T${time}`);
    await chrome.alarms.create(`${CONFIG_ALARM_PREFIX}${schedule.id}`, { when: when.getTime(), periodInMinutes: repeat });
  }

  async clear(id: string) {
    await chrome.alarms.clear(`${CONFIG_ALARM_PREFIX}${id}`);
  }
}

auth.authStateReady().then(() => {
  chrome.alarms.onAlarm.addListener(async ({ name }) => {
    if (name.includes(CONFIG_ALARM_PREFIX)) {
      const configId = name.replace(CONFIG_ALARM_PREFIX, '');
      const configs = await getConfigs();
      const config = configs.find((config) => config.id === configId);
      if (config) {
        chrome.tabs.create({ url: config.url });
      }
    }
  });
});
