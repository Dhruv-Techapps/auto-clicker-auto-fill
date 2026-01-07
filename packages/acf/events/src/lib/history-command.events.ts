import { SystemError } from '@dhruv-techapps/core-common';
import { Logger } from '@dhruv-techapps/core-open-telemetry/content-script';
import CommonEvents from './common.events';

const HISTORY_COMMANDS = ['back', 'forward', 'go', 'pushState', 'replaceState'];

export const HistoryCommandEvents = (() => {
  const execCommand = (commands: Array<string | Event>, value: string) => {
    commands.forEach((command) => {
      switch (command) {
        case 'back':
          window.history.back();
          break;
        case 'forward':
          window.history.forward();
          break;
        case 'go': {
          const steps = parseInt(value.split('::')[2], 10);
          window.history.go(steps);
          break;
        }
        case 'pushState': {
          const [state, title, url] = JSON.parse(value.split('::')[2]);
          window.history.pushState(state, title, url);
          break;
        }
        case 'replaceState': {
          const [state, title, url] = JSON.parse(value.split('::')[2]);
          window.history.replaceState(state, title, url);
          break;
        }
        default:
          if (command instanceof Event) {
            throw new SystemError('Unhandled Event', JSON.stringify(command));
          }
          throw new SystemError('Unhandled Event', command);
      }
    });
  };

  const start = (value: string) => {
    const commands = CommonEvents.getVerifiedEvents(HISTORY_COMMANDS, value);
    Logger.debug('HistoryCommandEvents', {
      actionId: window.ext.__currentAction,
      actionName: window.ext.__currentActionName
    });
    execCommand(commands, value);
  };

  return { start };
})();
