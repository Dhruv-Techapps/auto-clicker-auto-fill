import { TRandomUUID } from '@dhruv-techapps/core-common';
import { CoreService } from '@dhruv-techapps/core-service';
import type { AttributeValue, Exception, SpanOptions, SpanStatus, TimeInput } from '@opentelemetry/api';
import type { AnyValueMap, LogRecord } from '@opentelemetry/api-logs';
import { ATTRIBUTE_ERROR_MESSAGE, ATTRIBUTE_ERROR_STACK, ATTRIBUTE_ERROR_TYPE, CoreLogger } from './lib/logger';
import { RUNTIME_MESSAGE_OPEN_TELEMETRY } from './lib/open-telemetry-constant';
import type { OpenTelemetryRequest } from './lib/open-telemetry.types';

export class OpenTelemetryService extends CoreService {
  static async startActiveSpan(key: TRandomUUID, name: string, rest?: { headers?: Record<string, string>; options?: SpanOptions; attributes?: Record<string, AttributeValue> }) {
    return await this.message<OpenTelemetryRequest, Record<string, string>>({
      messenger: RUNTIME_MESSAGE_OPEN_TELEMETRY,
      methodName: 'startActiveSpan',
      message: { key, name, ...rest, options: { ...(rest?.options || {}), kind: 3, root: true } }
    });
  }

  static async startSpan(key: TRandomUUID, name: string, rest?: { headers?: Record<string, string>; options?: SpanOptions; attributes?: Record<string, AttributeValue> }) {
    return await this.message<OpenTelemetryRequest, Record<string, string>>({
      messenger: RUNTIME_MESSAGE_OPEN_TELEMETRY,
      methodName: 'startSpan',
      message: { key, name, ...rest }
    });
  }

  static async endSpan(key: TRandomUUID, status?: SpanStatus) {
    return await this.message<OpenTelemetryRequest>({ messenger: RUNTIME_MESSAGE_OPEN_TELEMETRY, methodName: 'endSpan', message: { key, status } });
  }

  static async recordException(key: TRandomUUID, exception: Exception, time?: TimeInput) {
    return await this.message<OpenTelemetryRequest>({ messenger: RUNTIME_MESSAGE_OPEN_TELEMETRY, methodName: 'recordException', message: { key, exception, time } });
  }

  static async setAttribute(key: TRandomUUID, attributeKey: string, attributeValue: AttributeValue) {
    return await this.message<OpenTelemetryRequest>({ messenger: RUNTIME_MESSAGE_OPEN_TELEMETRY, methodName: 'setAttribute', message: { key, attributeKey, attributeValue } });
  }

  static async addEvent(key: TRandomUUID, name: string, attributes?: Record<string, AttributeValue>) {
    return await this.message<OpenTelemetryRequest>({ messenger: RUNTIME_MESSAGE_OPEN_TELEMETRY, methodName: 'addEvent', message: { key, name, attributes } });
  }

  static async log(logRecord: LogRecord) {
    return await this.message<OpenTelemetryRequest>({ messenger: RUNTIME_MESSAGE_OPEN_TELEMETRY, methodName: 'log', message: logRecord });
  }
}

export class LoggerService extends CoreLogger {
  static override emit(logRecord: LogRecord) {
    return OpenTelemetryService.log(logRecord);
  }
}
const sharedHandleError = (key: TRandomUUID, event: unknown, message: string, logger: 'error' | 'fatal', attributes?: AnyValueMap) => {
  const error: Error = event instanceof Error ? event : new Error(typeof event === 'string' ? event : JSON.stringify(event));
  const errorAttribute = {
    [ATTRIBUTE_ERROR_TYPE]: error.name,
    [ATTRIBUTE_ERROR_MESSAGE]: error.message,
    [ATTRIBUTE_ERROR_STACK]: error.stack || 'N/A'
  };

  const exception: Exception = {
    message: error.message,
    name: error.name,
    stack: error.stack || 'N/A'
  };

  OpenTelemetryService.recordException(key, exception);
  OpenTelemetryService.addEvent(key, 'error', errorAttribute);

  attributes = {
    ...errorAttribute,
    ...attributes
  };
  LoggerService[logger](message, error, attributes);
};

export const handleError = (key: TRandomUUID, event: unknown, message: string, attributes?: AnyValueMap) => sharedHandleError(key, event, message, 'error', attributes);
export const handleFatalError = (key: TRandomUUID, event: unknown, message: string, attributes?: AnyValueMap) => sharedHandleError(key, event, message, 'fatal', attributes);
