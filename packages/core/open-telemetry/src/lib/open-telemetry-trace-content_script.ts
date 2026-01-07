import { context, Span, trace } from '@opentelemetry/api';
import { ZoneContextManager } from '@opentelemetry/context-zone'; // or StackContextManager for SW
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ServiceWorkerTraceExporter } from './exporter/service-worker';
import { handleError as sharedHandleError } from './handle-error';
import { Logger } from './open-telemetry-logger-content_script';
import { resource } from './resource/open-telemetry-resource';

const serviceWorkerProcessor = new SimpleSpanProcessor(new ServiceWorkerTraceExporter());
const provider = new WebTracerProvider({
  spanProcessors: [serviceWorkerProcessor],
  resource
});
provider.register({
  contextManager: new ZoneContextManager()
});
trace.setGlobalTracerProvider(provider);

export const tracer = trace.getTracer('content-script', chrome.runtime.getManifest().version);
export { SpanKind, SpanStatusCode, type Span } from '@opentelemetry/api';
export { context, trace };

export const handleError = (span: Span, event: unknown, message: string, attributes?: Record<string, unknown>) => sharedHandleError(span, event, message, attributes, Logger);
