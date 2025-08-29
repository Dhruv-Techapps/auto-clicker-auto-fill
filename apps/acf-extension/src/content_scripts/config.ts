import { IConfiguration } from '@dhruv-techapps/acf-common';
import { MainWorldService } from '@dhruv-techapps/acf-main-world';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { Session } from '@dhruv-techapps/acf-util';
import { ConfigError } from '@dhruv-techapps/core-common';
import { NotificationsService } from '@dhruv-techapps/core-service';
import { DiscordMessagingColor, DiscordMessagingService } from '@dhruv-techapps/shared-discord-messaging';
import { GoogleAnalyticsService } from '@dhruv-techapps/shared-google-analytics';
import { GoogleSheetsCS } from '@dhruv-techapps/shared-google-sheets';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
import { scope } from '../common/instrument';
import Actions from './actions';
import BatchProcessor from './batch';
import Common from './common';
import { Hotkey } from './hotkey';
import { I18N_COMMON } from './i18n';
import { statusBar } from './status-bar';
import DomWatchManager from './util/dom-watch-manager';
import GoogleSheets from './util/google-sheets';

const CONFIG_I18N = {
  TITLE: chrome.i18n.getMessage('@CONFIG__TITLE')
};
const ConfigProcessor = (() => {
  const getFields = (config: IConfiguration) => {
    const fields = [{ name: 'URL', value: config.url }];
    if (config.name) {
      fields.unshift({ name: 'name', value: config.name });
    }
    return fields;
  };

  const getEvents = (config: IConfiguration) => {
    const events: { [key: string]: string | number | boolean | undefined } = { url: config.url, loadType: config.loadType, actions: config.actions.length };
    if (config.batch) {
      events['batch'] = config.batch.refresh || config.batch.repeat;
    }
    if (config.spreadsheetId) {
      events.sheets = true;
    }
    if (config.actions.some((a) => a.addon)) {
      events.addon = true;
    }
    if (config.actions.some((a) => a.statement)) {
      events.statement = true;
    }
    return events;
  };

  const InitializeDomWatcher = (config: IConfiguration) => {
    // If watch settings are provided and enabled, set up DOM watcher for the entire configuration
    if (config.watch?.watchEnabled) {
      // Set up the sequence restart callback for DOM watcher
      DomWatchManager.setSequenceRestartCallback(async () => {
        console.debug(`Actions: Restarting entire action sequence due to DOM changes`);
        await Actions.start(config.actions, window.ext.__batchRepeat + 1);
      });

      // Register the configuration-level DOM watcher after actions complete initially
      DomWatchManager.registerConfiguration(config.watch);
    }
  };

  const start = async (config: IConfiguration) => {
    try {
      window.ext.__sessionCount = new Session(config.id).getCount();
      if (config.bypass) {
        await MainWorldService.bypass(config.bypass);
      }
      const sheets = GoogleSheets.getSheets(config);
      window.ext.__sheets = await new GoogleSheetsCS().getValues(sheets, config.spreadsheetId);
      // Clear any existing DOM watchers before starting new actions
      await BatchProcessor.start(config.actions, config.batch);
      InitializeDomWatcher(config);
      const { notifications } = await new SettingsStorage().getSettings();
      if (notifications) {
        const { onConfig, sound, discord } = notifications;
        if (onConfig) {
          NotificationsService.create({
            type: 'basic',
            title: `${CONFIG_I18N.TITLE} ${I18N_COMMON.COMPLETED}`,
            message: config.name || config.url,
            silent: !sound,
            iconUrl: Common.getNotificationIcon()
          });
          if (discord) {
            DiscordMessagingService.push(`${CONFIG_I18N.TITLE} ${I18N_COMMON.COMPLETED}`, getFields(config));
          }
        }
      }
      statusBar.done();
      GoogleAnalyticsService.fireEvent('configuration_completed', getEvents(config));
    } catch (e) {
      if (e instanceof ConfigError) {
        statusBar.error(e.message);
        const error = { title: e.title, message: `${e.message}\n on ${config.url}` };
        const { notifications } = await new SettingsStorage().getSettings();
        if (notifications?.onError) {
          const { sound, discord } = notifications;
          NotificationsService.create({ type: 'basic', ...error, silent: !sound, iconUrl: Common.getNotificationIcon() }, 'error');
          if (discord) {
            DiscordMessagingService.push(
              e.title || `${CONFIG_I18N.TITLE} ${I18N_COMMON.ERROR}`,
              [
                ...getFields(config),
                ...e.message.split('\n').map((info) => {
                  const [name, value] = info.split(':');
                  return { name, value: value.replace(/'/g, '`') };
                })
              ],
              DiscordMessagingColor.ERROR
            );
          }
        } else {
          console.error('%s: %s', error.title, error.message);
        }
        scope.captureMessage(e.message, 'warning', { data: { title: e.title } });
      } else {
        throw e;
      }
    }
  };

  const schedule = async (startTime: string) => {
    console.debug(I18N_COMMON.SCHEDULE, { startTime: startTime });
    const rDate = new Date();
    rDate.setHours(Number(startTime.split(':')[0]));
    rDate.setMinutes(Number(startTime.split(':')[1]));
    rDate.setSeconds(Number(startTime.split(':')[2]));
    rDate.setMilliseconds(Number(startTime.split(':')[3]));
    console.debug(I18N_COMMON.SCHEDULE, { date: rDate });
    await new Promise((resolve) => {
      setTimeout(resolve, rDate.getTime() - new Date().getTime());
    });
  };

  const checkStartTime = async (config: IConfiguration) => {
    if (config.startTime?.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)) {
      await schedule(config.startTime);
    } else {
      await statusBar.wait(config.initWait, STATUS_BAR_TYPE.CONFIG_WAIT);
    }
  };

  const setupStatusBar = async () => {
    const { statusBar: statusBarLocation } = await new SettingsStorage().getSettings();
    statusBar.setLocation(statusBarLocation);
  };

  const checkStartType = async (configs: Array<IConfiguration>, config?: IConfiguration) => {
    setupStatusBar();
    configs.forEach((c) => {
      Hotkey.setup(start.bind(this, c), c.hotkey);
    });
    if (config) {
      await checkStartTime(config);
      await start(config);
    }
  };

  return { checkStartType };
})();

export default ConfigProcessor;
