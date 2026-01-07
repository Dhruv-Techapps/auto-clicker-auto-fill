import { ISchedule } from '@dhruv-techapps/acf-common';
import { ConfigStorage } from '@dhruv-techapps/acf-store';
import { TRandomUUID } from '@dhruv-techapps/core-common';
import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { auth } from './firebase';

interface IAlarmSchedule {
  schedule: ISchedule;
  id: TRandomUUID;
}

const CONFIG_ALARM_PREFIX = 'config-alarm-';

export class AcfSchedule {
  async check() {
    Logger.info('AcfSchedule:check', { message: 'Checking scheduled configurations' });
    const schedules: Array<IAlarmSchedule> = (await ConfigStorage.getConfigs()).filter((config) => config.schedule).map((config) => ({ id: config.id, schedule: config.schedule }) as IAlarmSchedule);
    for (const schedule of schedules) {
      const alarm = await chrome.alarms.get(schedule.id);
      if (!alarm) {
        this.create(schedule);
      }
    }
  }

  async create(schedule: IAlarmSchedule) {
    Logger.info('AcfSchedule:create', { message: `Creating alarm for schedule: ${schedule.id}` });
    const { date, time, repeat } = schedule.schedule;
    const when = new Date(`${date}T${time}`);
    await chrome.alarms.create(`${CONFIG_ALARM_PREFIX}${schedule.id}`, { when: when.getTime(), periodInMinutes: repeat });
  }

  async clear(id: string) {
    Logger.info('AcfSchedule:clear', { message: `Clearing alarm for schedule: ${id}` });
    await chrome.alarms.clear(`${CONFIG_ALARM_PREFIX}${id}`);
  }
}

auth.authStateReady().then(() => {
  chrome.alarms.onAlarm.addListener(async ({ name }) => {
    Logger.info('AcfSchedule:alarmTriggered', { message: `Alarm triggered: ${name}` });
    if (name.includes(CONFIG_ALARM_PREFIX)) {
      const configId = name.replace(CONFIG_ALARM_PREFIX, '');
      const configs = await ConfigStorage.getConfigs();
      const config = configs.find((config) => config.id === configId);
      if (config) {
        chrome.tabs.create({ url: config.url });
      }
    }
  });
});
