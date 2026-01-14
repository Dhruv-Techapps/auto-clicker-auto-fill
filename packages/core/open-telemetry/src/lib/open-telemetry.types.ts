import type { AttributeValue, Exception, SpanOptions, SpanStatus, TimeInput } from '@opentelemetry/api';
import type { LogRecord } from '@opentelemetry/api-logs';

interface CommonOpenTelemetryMessage {
  key: string;
  headers?: Record<string, string>;
}

export interface StartActiveSpanMessage extends CommonOpenTelemetryMessage {
  name: string;
  options: SpanOptions;
  attributes?: Record<string, AttributeValue>;
}

export interface EndSpanMessage extends CommonOpenTelemetryMessage {
  status?: SpanStatus;
}

export interface RecordExceptionMessage extends CommonOpenTelemetryMessage {
  exception: Exception;
  time?: TimeInput;
}

export interface SpanAttributeMessage extends CommonOpenTelemetryMessage {
  attributeKey: string;
  attributeValue: AttributeValue;
}

export interface SpanEventMessage extends CommonOpenTelemetryMessage {
  name: string;
  attributes?: Record<string, AttributeValue>;
}

export interface OpenTelemetryRequest {
  messenger: 'open-telemetry';
  methodName: 'log' | 'setAttribute' | 'startActiveSpan' | 'startSpan' | 'endSpan' | 'recordException' | 'addEvent';
  message: LogRecord | SpanAttributeMessage | StartActiveSpanMessage | EndSpanMessage | RecordExceptionMessage | SpanEventMessage;
}
