import { logs } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

const loggerProvider = new LoggerProvider({
  processors: [
    new SimpleLogRecordProcessor(
      new OTLPLogExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        headers: {
          Authorization: process.env.OTEL_EXPORTER_OTLP_HEADERS || ''
        }
      })
    )
  ]
});

/* Initialize LoggerProvider */
logs.setGlobalLoggerProvider(loggerProvider);
/* returns loggerProvider (no-op if a working provider has not been initialized) */
logs.getLoggerProvider();
/* returns a logger from the registered global logger provider (no-op if a working provider has not been initialized) */
const logger = logs.getLogger('name', '9.9.9', {
  schemaUrl: 'https://opentelemetry.io/schemas/1.17.0',
  includeTraceContext: true
});

export { logger };
