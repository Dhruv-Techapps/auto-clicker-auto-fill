/*instrumentation.ts*/
import * as api from '@opentelemetry/api';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {
      Authorization: process.env.OTEL_EXPORTER_OTLP_HEADERS || ''
    }
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter()
  })
});
const contextManager = new AsyncHooksContextManager();
contextManager.enable();
api.context.setGlobalContextManager(contextManager);
sdk.start();
