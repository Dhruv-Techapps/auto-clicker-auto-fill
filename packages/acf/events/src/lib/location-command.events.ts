import { SystemError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

const LOCATION_COMMANDS = ['reload', 'href', 'replace', 'open', 'close', 'focus', 'blur', 'print', 'stop', 'moveBy', 'moveTo'];

const sanitizeUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.href;
  } catch {
    return null;
  }
};

export const LocationCommandEvents = (() => {
  const execCommand = (commands: Array<string | Event>, value: string) => {
    commands.forEach((command) => {
      switch (command) {
        case 'reload':
          window.location.reload();
          break;
        case 'href': {
          const sanitizedValue = sanitizeUrl(value.split('::')[2]);
          if (sanitizedValue) {
            window.location.href = sanitizedValue;
          } else {
            console.error('Invalid URL provided for href command');
          }
          break;
        }
        case 'replace':
          window.location.replace(value.split('::')[2]);
          break;
        case 'focus':
          window.focus();
          break;
        case 'blur':
          window.blur();
          break;
        case 'print':
          window.print();
          break;
        case 'stop':
          window.stop();
          break;
        case 'moveBy':
          // eslint-disable-next-line no-case-declarations
          const [x, y] = value.split('::')[2].split(',');
          window.moveBy(Number(x), Number(y));
          break;
        case 'moveTo':
          // eslint-disable-next-line no-case-declarations
          const [xAxis, yAxis] = value.split('::')[2].split(',');
          window.moveTo(Number(xAxis), Number(yAxis));
          break;
        case 'open':
          try {
            const { URL, name, specs } = JSON.parse(value.split('::')[2]);
            window.open(URL, name, specs);
          } catch {
            window.open(value.split('::')[2]);
          }
          break;
        case 'close':
          window.close();
          break;
        default:
          if (command instanceof Event) {
            throw new SystemError('Unhandled Event', JSON.stringify(command));
          }
          throw new SystemError('Unhandled Event', command);
      }
    });
  };

  const start = (value: string) => {
    const commands = CommonEvents.getVerifiedEvents(LOCATION_COMMANDS, value);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, commands);
    execCommand(commands, value);
  };
  return { start };
})();
