import { IConfiguration } from '@dhruv-techapps/acf-common';
import { MainWorldService } from '@dhruv-techapps/acf-main-world/service';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { Session } from '@dhruv-techapps/acf-util';
import { ConfigError, generateUUID } from '@dhruv-techapps/core-common';
import { handleError, LoggerService, OpenTelemetryService } from '@dhruv-techapps/core-open-telemetry/content-script';
import { NotificationsService, SessionStorageService } from '@dhruv-techapps/core-service';
import { DiscordMessagingColor, DiscordMessagingService } from '@dhruv-techapps/shared-discord-messaging/service';
import { GoogleAnalyticsService, TEventSource } from '@dhruv-techapps/shared-google-analytics/service';
import { GoogleSheetsContentScript } from '@dhruv-techapps/shared-google-sheets/content_script';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/shared-status-bar';
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

  const allowEvent = async (url: string): Promise<boolean> => {
    const key = 'ga4-event-fired-urls';
    if (!url) return false;
    const { [key]: urls = [] } = await SessionStorageService.get(key);
    if (urls.includes(url)) return false;
    urls.push(url);
    await SessionStorageService.set({ [key]: urls });
    return true;
  };

  const getEvents = async (config: IConfiguration) => {
    const isAllowed = await allowEvent(config.url);
    if (!isAllowed) {
      return null;
    }
    const events: { [key: string]: string | number | boolean | undefined; source: TEventSource } = {
      url: config.url,
      loadType: config.loadType,
      actions: config.actions.length,
      source: 'content_script'
    };
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
      window.ext.__sheets = await new GoogleSheetsContentScript().getValues(sheets, config.spreadsheetId);
      // Clear any existing DOM watchers before starting new actions
      await BatchProcessor.start(config.actions, config.batch);
      InitializeDomWatcher(config);
      const { notifications } = await SettingsStorage.getSettings();
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
      const event = await getEvents(config);
      if (event) {
        GoogleAnalyticsService.fireEvent('configuration_completed', event);
      }
    } catch (e) {
      if (e instanceof ConfigError) {
        statusBar.error(e.message);
        const error = { title: e.title, message: `${e.message}\n on ${config.url}` };
        const { notifications } = await SettingsStorage.getSettings();
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
      } else {
        throw e;
      }
    }
  };

  const schedule = async (startTime: string) => {
    LoggerService.debug(I18N_COMMON.SCHEDULE, { startTime: startTime });
    const rDate = new Date();
    rDate.setHours(Number(startTime.split(':')[0]));
    rDate.setMinutes(Number(startTime.split(':')[1]));
    rDate.setSeconds(Number(startTime.split(':')[2]));
    rDate.setMilliseconds(Number(startTime.split(':')[3]));
    LoggerService.debug(I18N_COMMON.SCHEDULE, { startTime: rDate.toISOString() });
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
    const { statusBar: statusBarLocation } = await SettingsStorage.getSettings();
    statusBar.setLocation(statusBarLocation);
  };

  const checkStartType = async (configs: Array<IConfiguration>, config?: IConfiguration) => {
    await setupStatusBar();
    configs.forEach((c) => {
      Hotkey.setup(start.bind(this, c), c.hotkey);
    });
    if (config) {
      const key = generateUUID();
      try {
        window.ext.__configHeaders = await OpenTelemetryService.startActiveSpan(key, 'Configuration', { attributes: { loadType: config.loadType, url: config.url } });
        statusBar.enable(config.actions.length, config.batch?.repeat);
        await checkStartTime(config);
        await start(config);
      } catch (error) {
        handleError(key, error, 'Error in Configuration');
        throw error;
      } finally {
        OpenTelemetryService.endSpan(key);
        window.ext.__configHeaders = undefined;
      }
    }
  };

  return { checkStartType };
})();

export default ConfigProcessor;
