import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

if (!process.env.VITE_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT || !process.env.VITE_PUBLIC_OTEL_EXPORTER_OTLP_TOKEN) {
  throw new Error('OTLP Exporter endpoint or token is not defined in environment variables');
}

const collectorOptions = (type: 'traces' | 'logs') => ({
  url: `${process.env.VITE_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT}/v1/${type}`,
  headers: {
    Authorization: `Basic ${process.env.VITE_PUBLIC_OTEL_EXPORTER_OTLP_TOKEN}`
  },
  concurrencyLimit: 10 // an optional limit on pending requests
});

const otlpTraceExporter = new OTLPTraceExporter(collectorOptions('traces'));

const otlpLogExporter = new OTLPLogExporter(collectorOptions('logs'));

export { otlpLogExporter, otlpTraceExporter };

export const bufferConfig = {
  // The maximum queue size. After the size is reached spans are dropped.
  maxQueueSize: 100,
  // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
  maxExportBatchSize: 10,
  // The interval between two consecutive exports
  scheduledDelayMillis: 500,
  // How long the export can run before it is cancelled
  exportTimeoutMillis: 30000
};
