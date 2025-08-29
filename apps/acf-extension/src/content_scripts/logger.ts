import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { EnhancedLogger, ELoggingLevel } from '@dhruv-techapps/core-common';

export class ContentScriptLogger {
  private static instance: ContentScriptLogger;
  private logger: EnhancedLogger;
  private initialized = false;

  private constructor() {
    this.logger = EnhancedLogger.getInstance();
  }

  public static getInstance(): ContentScriptLogger {
    if (!ContentScriptLogger.instance) {
      ContentScriptLogger.instance = new ContentScriptLogger();
    }
    return ContentScriptLogger.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const settings = await new SettingsStorage().getSettings();
      const logging = settings.logging;
      
      if (logging) {
        // Convert string enum to number enum
        let level = ELoggingLevel.WARN;
        switch (logging.level) {
          case 'error':
            level = ELoggingLevel.ERROR;
            break;
          case 'warn':
            level = ELoggingLevel.WARN;
            break;
          case 'info':
            level = ELoggingLevel.INFO;
            break;
          case 'debug':
            level = ELoggingLevel.DEBUG;
            break;
          case 'trace':
            level = ELoggingLevel.TRACE;
            break;
        }

        this.logger.configure({
          level,
          enableVerbose: logging.enableVerbose,
          useRingBuffer: logging.useRingBuffer,
          ringBufferSize: logging.ringBufferSize
        });
      }
      
      this.initialized = true;
    } catch (error) {
      // Fallback to default configuration
      console.warn('Failed to load logging settings, using defaults:', error);
      this.initialized = true;
    }
  }

  public error(scopes: string[], message: string, meta?: unknown): void {
    this.logger.error(scopes, message, meta);
  }

  public warn(scopes: string[], message: string, meta?: unknown): void {
    this.logger.warn(scopes, message, meta);
  }

  public info(scopes: string[], message: string, meta?: unknown): void {
    this.logger.info(scopes, message, meta);
  }

  public debug(scopes: string[], message: string, meta?: unknown): void {
    this.logger.debug(scopes, message, meta);
  }

  public trace(scopes: string[], message: string, meta?: unknown): void {
    this.logger.trace(scopes, message, meta);
  }

  public getRingBuffer() {
    return this.logger.getRingBuffer();
  }

  public clearRingBuffer(): void {
    this.logger.clearRingBuffer();
  }
}

// Global logger instance
export const logger = ContentScriptLogger.getInstance();