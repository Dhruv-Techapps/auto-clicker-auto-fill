import { SystemError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';
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
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, commands);
    execCommand(commands, value);
  };

  return { start };
})();
