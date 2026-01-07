import { Logger } from '@dhruv-techapps/core-open-telemetry/background';
import { context, propagation, SpanStatusCode, trace } from '@opentelemetry/api';
import { ActionMessenger, AlarmsMessenger, ManifestMessenger, NotificationsMessenger, SessionStorageMessenger, StorageMessenger, UserScriptsMessenger } from './messenger';
export interface MessengerConfigObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const messageListener = async (request: any, sender: chrome.runtime.MessageSender, configs: MessengerConfigObject): Promise<any> => {
  const { messenger, methodName, message, carrier } = request;
  let span = null;
  if (carrier) {
    const activeContext = propagation.extract(context.active(), carrier);
    span = trace.getTracer('background').startSpan(`${messenger}.${methodName}`, {}, activeContext);
  }
  try {
    switch (messenger) {
      case 'notifications':
        return new NotificationsMessenger()[(methodName as keyof NotificationsMessenger) || 'create'](message);
      case 'storage':
        return new StorageMessenger()[(methodName as keyof StorageMessenger) || 'get'](message);
      case 'session-storage':
        return new SessionStorageMessenger()[(methodName as keyof SessionStorageMessenger) || 'get'](message);
      case 'manifest':
        return new ManifestMessenger()[(methodName as keyof ManifestMessenger) || 'values'](message);
      case 'action':
        return new ActionMessenger()[(methodName as keyof ActionMessenger) || 'setIcon'](message, sender);
      case 'alarms':
        return new AlarmsMessenger()[(methodName as keyof AlarmsMessenger) || 'create'](message);
      case 'userScripts':
        return new UserScriptsMessenger()[(methodName as keyof UserScriptsMessenger) || 'execute'](message, sender);
      default:
        if (configs[messenger]) {
          if (typeof configs[messenger][methodName] === 'function') {
            return configs[messenger][methodName](message, sender);
          } else {
            throw new Error(`${messenger} ${chrome.i18n.getMessage('@PORT__METHOD_NOT_FOUND')}`);
          }
        } else {
          throw new Error(`${messenger} ${chrome.i18n.getMessage('@PORT__ACTION_NOT_FOUND')}`);
        }
    }
  } catch (error) {
    Logger.error('background.messageListener', {
      'messenger.name': messenger,
      'method.name': methodName,
      'error.message': error instanceof Error ? error.message : String(error),
      'error.stack': error instanceof Error ? error.stack : 'N/A'
    });
    span?.recordException(error instanceof Error ? error : new Error(String(error)));
    span?.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : String(error)
    });
    if (error instanceof Error) {
      throw new Error(`${messenger}.${methodName} ${error.message}`);
    } else {
      throw new Error(`${messenger}.${methodName} ${error}`);
    }
  } finally {
    span?.end();
  }
};

export class Runtime {
  static onMessage(configs: MessengerConfigObject) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      messageListener(request, sender, configs)
        .then(sendResponse)
        .catch((error) => {
          sendResponse({ error: error.message });
          Logger.error('Runtime.onMessage', { message: error.message, stack: error.stack });
        });
      return true;
    });
  }

  static onMessageExternal(configs: MessengerConfigObject) {
    chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
      messageListener(request, sender, configs)
        .then(sendResponse)
        .catch((error) => {
          sendResponse({ error: error.message });
        });
      return true;
    });
  }
}
