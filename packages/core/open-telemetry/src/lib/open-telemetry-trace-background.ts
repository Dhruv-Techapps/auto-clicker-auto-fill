import { context, Span, trace } from '@opentelemetry/api';
import { ZoneContextManager } from '@opentelemetry/context-zone'; // or StackContextManager for SW
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { otlpTraceExporter } from './exporter/otlp-exporter';
import { handleError as sharedHandleError } from './handle-error';
import { Logger } from './open-telemetry-logger-background';
import { resource } from './resource/open-telemetry-resource';

const spanProcessor = new SimpleSpanProcessor(otlpTraceExporter);
const consoleProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
const provider = new WebTracerProvider({
  spanProcessors: [consoleProcessor, spanProcessor],
  resource
});
provider.register({
  contextManager: new ZoneContextManager()
});
trace.setGlobalTracerProvider(provider);
registerInstrumentations({
  instrumentations: [
    /*new FetchInstrumentation({
      // Ignore certain URLs from being instrumented
      ignoreUrls: [/otlp-gateway-prod-ap-south-1.grafana.net/],
      // Add custom headers to your outgoing requests
      propagateTraceHeaderCorsUrls: [
        /.+/g // Propagate to all URLs, for demo purposes
      ]
    })*/
  ]
});
export const tracer = trace.getTracer('service-worker', chrome.runtime.getManifest().version);
export { SpanKind, SpanStatusCode, type Span } from '@opentelemetry/api';
export { context, trace };

export const handleError = (span: Span, event: unknown, message: string, attributes?: Record<string, unknown>) => sharedHandleError(span, event, message, attributes, Logger);
