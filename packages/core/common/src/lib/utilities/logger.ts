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

export enum ELoggingLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4
}

export interface ILogEntry {
  timestamp: number;
  level: ELoggingLevel;
  scopes: string[];
  message: string;
  meta?: unknown;
}

export interface ILoggerConfig {
  level: ELoggingLevel;
  enableVerbose: boolean;
  useRingBuffer: boolean;
  ringBufferSize: number;
}

export class RingBuffer<T> {
  private buffer: T[] = [];
  private size: number;
  private index = 0;

  constructor(size: number) {
    this.size = size;
  }

  push(item: T): void {
    this.buffer[this.index] = item;
    this.index = (this.index + 1) % this.size;
  }

  getAll(): T[] {
    const start = this.buffer.length < this.size ? 0 : this.index;
    return [...this.buffer.slice(start), ...this.buffer.slice(0, start)].filter(Boolean);
  }

  clear(): void {
    this.buffer = [];
    this.index = 0;
  }

  getSize(): number {
    return Math.min(this.buffer.length, this.size);
  }
}

export class EnhancedLogger {
  private static instance: EnhancedLogger;
  private config: ILoggerConfig = {
    level: ELoggingLevel.WARN,
    enableVerbose: false,
    useRingBuffer: true,
    ringBufferSize: 500
  };
  private ringBuffer: RingBuffer<ILogEntry>;

  private constructor() {
    this.ringBuffer = new RingBuffer<ILogEntry>(this.config.ringBufferSize);
  }

  public static getInstance(): EnhancedLogger {
    if (!EnhancedLogger.instance) {
      EnhancedLogger.instance = new EnhancedLogger();
    }
    return EnhancedLogger.instance;
  }

  public configure(config: Partial<ILoggerConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.ringBufferSize && config.ringBufferSize !== this.ringBuffer['size']) {
      this.ringBuffer = new RingBuffer<ILogEntry>(config.ringBufferSize);
    }
  }

  public log(level: ELoggingLevel, scopes: string[], message: string, meta?: unknown): void {
    // Always log errors and warnings
    const shouldLog = level <= ELoggingLevel.WARN || (this.config.enableVerbose && level <= this.config.level);
    
    const entry: ILogEntry = {
      timestamp: Date.now(),
      level,
      scopes,
      message,
      meta
    };

    // Add to ring buffer if enabled
    if (this.config.useRingBuffer) {
      this.ringBuffer.push(entry);
    }

    // Log to console if appropriate
    if (shouldLog) {
      this.logToConsole(entry);
    }
  }

  private logToConsole(entry: ILogEntry): void {
    const scopesText = entry.scopes.length > 0 ? entry.scopes.map(s => `[${s}]`).join('') : '';
    const prefix = `%c[ACF]${scopesText}`;
    const args = [prefix, LoggerColor.PRIMARY, entry.message];
    
    if (entry.meta !== undefined) {
      args.push(entry.meta);
    }

    switch (entry.level) {
      case ELoggingLevel.ERROR:
        console.error(...args);
        break;
      case ELoggingLevel.WARN:
        console.warn(...args);
        break;
      case ELoggingLevel.INFO:
        console.info(...args);
        break;
      case ELoggingLevel.DEBUG:
        console.debug(...args);
        break;
      case ELoggingLevel.TRACE:
        console.debug(...args);
        break;
    }
  }

  public error(scopes: string[], message: string, meta?: unknown): void {
    this.log(ELoggingLevel.ERROR, scopes, message, meta);
  }

  public warn(scopes: string[], message: string, meta?: unknown): void {
    this.log(ELoggingLevel.WARN, scopes, message, meta);
  }

  public info(scopes: string[], message: string, meta?: unknown): void {
    this.log(ELoggingLevel.INFO, scopes, message, meta);
  }

  public debug(scopes: string[], message: string, meta?: unknown): void {
    this.log(ELoggingLevel.DEBUG, scopes, message, meta);
  }

  public trace(scopes: string[], message: string, meta?: unknown): void {
    this.log(ELoggingLevel.TRACE, scopes, message, meta);
  }

  public getRingBuffer(): ILogEntry[] {
    return this.ringBuffer.getAll();
  }

  public clearRingBuffer(): void {
    this.ringBuffer.clear();
  }

  public getConfig(): ILoggerConfig {
    return { ...this.config };
  }
}

// Legacy Logger class for backward compatibility
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
