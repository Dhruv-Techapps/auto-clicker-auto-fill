import { context, propagation, Span } from '@opentelemetry/api';
import { logs } from '@opentelemetry/api-logs';
import { trace } from './lib/open-telemetry-trace-background';
import type { EndSpanMessage, LogMessage, RecordExceptionMessage, SpanAttributeMessage, SpanEventMessage, StartActiveSpanMessage } from './lib/open-telemetry.types';

export * from './lib/open-telemetry-constant';
export * from './lib/open-telemetry-logger-background';
export * from './lib/open-telemetry-trace-background';

const { version } = chrome.runtime.getManifest();
const contentScriptLogger = logs.getLogger('content-script', version, {
  schemaUrl: 'https://opentelemetry.io/schemas/1.17.0',
  includeTraceContext: true
});

const activeSpans = new Map<string, Span>(); // key -> Span

export class OpenTelemetryBackground {
  private readonly tracer = trace.getTracer('content-script', version);
  // This class can be expanded in the future if needed
  async log({ logRecord, headers = {} }: LogMessage) {
    context.with(propagation.extract(context.active(), headers), () => {
      contentScriptLogger.emit(logRecord);
    });
  }

  async startActiveSpan({ key, name, options, attributes, headers = {} }: StartActiveSpanMessage): Promise<Record<string, string>> {
    return new Promise((resolve) => {
      context.with(propagation.extract(context.active(), headers), () => {
        this.tracer.startActiveSpan(name, options, (span) => {
          if (attributes) {
            Object.entries(attributes).forEach(([k, v]) => span.setAttribute(k, v));
          }
          activeSpans.set(key, span);
          const headers: Record<string, string> = {};
          propagation.inject(context.active(), headers);
          resolve(headers);
        });
      });
    });
  }

  async startSpan({ key, name, options, attributes, headers }: StartActiveSpanMessage): Promise<Record<string, string> | undefined> {
    if (!headers) {
      return;
    }
    return new Promise((resolve) => {
      context.with(propagation.extract(context.active(), headers), () => {
        this.tracer.startActiveSpan(name, options, (span) => {
          if (attributes) {
            Object.entries(attributes).forEach(([k, v]) => span.setAttribute(k, v));
          }
          activeSpans.set(key, span);
          const headers: Record<string, string> = {};
          propagation.inject(context.active(), headers);
          resolve(headers);
        });
      });
    });
  }

  async endSpan({ key, status }: EndSpanMessage) {
    const span = activeSpans.get(key);
    if (span) {
      if (status) span.setStatus(status);
      span.end();
      activeSpans.delete(key);
    }
  }

  async addEvent({ key, name, attributes }: SpanEventMessage) {
    const span = activeSpans.get(key);
    if (span) {
      span.addEvent(name, attributes);
    }
  }

  async setAttribute({ key, attributeKey, attributeValue }: SpanAttributeMessage) {
    const span = activeSpans.get(key);
    if (span) {
      span.setAttribute(attributeKey, attributeValue);
    }
  }

  async recordException(msg: RecordExceptionMessage) {
    const { key, exception, time } = msg;
    const span = activeSpans.get(key);
    if (span) {
      span.recordException(exception, time);
      span.setStatus({ code: 2 }); // 2 = ERROR
    }
  }
}
