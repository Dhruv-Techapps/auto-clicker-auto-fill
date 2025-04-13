/* eslint no-console: off */

export enum LoggerColor {
  PRIMARY = 'background-color:#712cf9;color:white;font-weight:bold;padding:0 5px;',
  BLUE = 'background-color:#0d6efd;color:white;',
  INDIGO = 'background-color:#6610f2;color:white;',
  PURPLE = 'background-color:#6f42c1;color:white;',
  PINK = 'background-color:#d63384;color:white;',
  RED = 'background-color:#dc3545;color:white;',
  ORANGE = 'background-color:#fd7e14;color:white;',
  YELLOW = 'background-color:#ffc107;',
  GREEN = 'background-color:#198754;color:white;',
  TEAL = 'background-color:#20c997;color:white;',
  CYAN = 'background-color:#0dcaf0;',
  BLACK = 'background-color:#000;color:white;',
  WHITE = 'background-color:#fff;',
  GRAY = 'background-color:#f8f9fa;font-style:italic;padding:0 5px;'
}

export type LoggerType = 'log' | 'warn' | 'error' | 'info' | 'debug';

export class Logger {
  static color(module: string, color: Logger, type: LoggerType = 'debug', ...args: unknown[]) {
    console[type].apply(null, [`%c${module}`, color, ...args]);
  }

  static colorLog(module: string, ...args: unknown[]) {
    console.log.apply(null, [`%c${module}`, LoggerColor.GRAY, ...args]);
  }

  static colorWarn(module: string, ...args: unknown[]) {
    console.warn.apply(null, [`%c${module}`, LoggerColor.YELLOW, ...args]);
  }

  static colorError(module: string, ...args: unknown[]) {
    console.error.apply(null, [`%c${module}`, LoggerColor.RED, ...args]);
  }

  static colorInfo(module: string, ...args: unknown[]) {
    console.info.apply(null, [`%c${module}`, LoggerColor.CYAN, ...args]);
  }

  static colorDebug(module: string, ...args: unknown[]) {
    console.debug.apply(null, [`%c${module}`, LoggerColor.GRAY, ...args]);
  }
}
