import type { AnyValue, AnyValueMap, LogRecord } from '@opentelemetry/api-logs';

export const ATTRIBUTE_ERROR_TYPE = 'error.type';
export const ATTRIBUTE_ERROR_MESSAGE = 'error.message';
export const ATTRIBUTE_ERROR_STACK = 'error.stack';

export class CoreLogger {
  static emit(logRecord: LogRecord) {
    console.log('LogRecord emitted:', logRecord);
  }

  static trace(body: AnyValue, attributes?: AnyValueMap) {
    this.emit({
      severityNumber: 1, // TRACE
      severityText: 'TRACE',
      body,
      attributes
    });
  }

  static debug(body: AnyValue, attributes?: AnyValueMap) {
    this.emit({
      severityNumber: 5, // DEBUG
      severityText: 'DEBUG',
      body,
      attributes
    });
  }

  static info(body: AnyValue, attributes?: AnyValueMap) {
    if (typeof attributes === 'string') {
      attributes = {
        message: attributes
      };
    }
    this.emit({
      severityNumber: 9, // INFO
      severityText: 'INFO',
      body,
      attributes
    });
  }

  static warn(body: AnyValue, attributes?: AnyValueMap) {
    this.emit({
      severityNumber: 13, // WARN
      severityText: 'WARN',
      body,
      attributes
    });
  }

  static error(body: AnyValue, error: unknown, attributes?: AnyValueMap) {
    if (error instanceof Error) {
      attributes = {
        ...attributes,
        [ATTRIBUTE_ERROR_MESSAGE]: error.message,
        [ATTRIBUTE_ERROR_STACK]: error.stack || 'N/A'
      };
    } else if (typeof error === 'string') {
      attributes = {
        ...attributes,
        [ATTRIBUTE_ERROR_MESSAGE]: error
      };
    } else {
      attributes = {
        ...attributes,
        [ATTRIBUTE_ERROR_MESSAGE]: JSON.stringify(error)
      };
    }

    this.emit({
      severityNumber: 17, // ERROR
      severityText: 'ERROR',
      body,
      attributes
    });
  }

  static fatal(body: AnyValue, error: unknown, attributes?: AnyValueMap) {
    if (error instanceof Error) {
      attributes = {
        ...attributes,
        [ATTRIBUTE_ERROR_MESSAGE]: error.message,
        [ATTRIBUTE_ERROR_STACK]: error.stack || 'N/A'
      };
    } else if (typeof error === 'string') {
      attributes = {
        ...attributes,
        [ATTRIBUTE_ERROR_MESSAGE]: error
      };
    } else {
      attributes = {
        ...attributes,
        [ATTRIBUTE_ERROR_MESSAGE]: JSON.stringify(error)
      };
    }
    this.emit({
      severityNumber: 21, // FATAL
      severityText: 'FATAL',
      body,
      attributes
    });
  }
}
