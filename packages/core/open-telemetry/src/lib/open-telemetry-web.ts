import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';

export const setupTelemetry = (resourceAttributes: Record<string, string>) => {
  resourceAttributes['service.name'] = 'Auto Clicker & Auto Fill';
  const resource = resourceFromAttributes(resourceAttributes);

  const consoleProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [consoleProcessor]
  });

  // Create and configure OTLP exporter

  // Use BatchSpanProcessor for better performance

  // Register the provider
  provider.register({
    contextManager: new ZoneContextManager()
  });

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new FetchInstrumentation({
        // Ignore certain URLs from being instrumented
        ignoreUrls: [/localhost:8090\/sockjs-node/],
        // Add custom headers to your outgoing requests
        propagateTraceHeaderCorsUrls: [
          /.+/g // Propagate to all URLs, for demo purposes
        ]
      }),
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [
          /.+/g // Propagate to all URLs, for demo purposes
        ]
      })
    ]
  });
};
