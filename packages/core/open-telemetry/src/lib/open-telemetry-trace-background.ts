import { context, propagation, Span, trace } from '@opentelemetry/api';
import { AnyValueMap } from '@opentelemetry/api-logs';
import { ZoneContextManager } from '@opentelemetry/context-zone'; // or StackContextManager for SW
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { bufferConfig, otlpTraceExporter } from './exporter/otlp-exporter';
import { handleError as sharedHandleError } from './handle-error';
import { Logger } from './open-telemetry-logger-background';
import { resource } from './resource/open-telemetry-resource';
import { sampler } from './sampler/open-telemetry-sampler';

const spanProcessor = new BatchSpanProcessor(otlpTraceExporter, bufferConfig);

const provider = new WebTracerProvider({
  spanProcessors: [spanProcessor],
  resource,
  ...(process.env.VITE_PUBLIC_VARIANT === 'LOCAL' ? {} : { sampler })
});
provider.register({
  contextManager: new ZoneContextManager()
});

export const tracer = trace.getTracer('service-worker', chrome.runtime.getManifest().version);
export { SpanKind, SpanStatusCode, type Span } from '@opentelemetry/api';
export { context, propagation, trace };

export const handleError = (span: Span, event: unknown, message: string, attributes?: AnyValueMap) => sharedHandleError(span, event, message, Logger.error.bind(Logger), attributes);
export const handleFatalError = (span: Span, event: unknown, message: string, attributes?: AnyValueMap) => sharedHandleError(span, event, message, Logger.fatal.bind(Logger), attributes);
