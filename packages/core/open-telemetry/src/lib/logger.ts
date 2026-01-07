import { AnyValue, AnyValueMap, LogRecord, logs } from '@opentelemetry/api-logs';

export const logger = logs.getLogger('common', '0.0.0', {
  schemaUrl: 'https://opentelemetry.io/schemas/1.17.0',
  includeTraceContext: true
});

export const ATTRIBUTE_ERROR_TYPE = 'error.type';
export const ATTRIBUTE_ERROR_MESSAGE = 'error.message';
export const ATTRIBUTE_ERROR_STACK = 'error.stack';

export class CoreLogger {
  static emit(logRecord: LogRecord) {
    logger.emit(logRecord);
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

  static info(body: AnyValue, attributes?: AnyValueMap | string) {
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
        [ATTRIBUTE_ERROR_STACK]: error.stack
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

  static fatal(body: AnyValue, attributes?: AnyValueMap) {
    this.emit({
      severityNumber: 21, // FATAL
      severityText: 'FATAL',
      body,
      attributes
    });
  }
}
