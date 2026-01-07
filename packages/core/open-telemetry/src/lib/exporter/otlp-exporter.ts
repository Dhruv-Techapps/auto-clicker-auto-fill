import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const collectorOptions = (type: 'traces' | 'logs') => ({
  url: `${process.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT}/v1/${type}`,
  headers: {
    Authorization: `Basic ${process.env.VITE_OTEL_EXPORTER_OTLP_TOKEN}`
  }
  //concurrencyLimit: 10 // an optional limit on pending requests
});

const otlpTraceExporter = new OTLPTraceExporter(collectorOptions('traces'));

const otlpLogExporter = new OTLPLogExporter(collectorOptions('logs'));

export { otlpLogExporter, otlpTraceExporter };
