export * from './lib/open-telemetry-constant';
export * from './lib/open-telemetry-logger-background';
export * from './lib/open-telemetry-trace-background';

const collectorOptions = (type: 'traces' | 'logs') => ({
  url: `${process.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT}/v1/${type}`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${process.env.VITE_OTEL_EXPORTER_OTLP_TOKEN}`
  }
});

export class OpenTelemetryBackground {
  // This class can be expanded in the future if needed
  async exportLogRecord(body: any, _sender: chrome.runtime.MessageSender) {
    try {
      const collector = collectorOptions('logs');
      fetch(collector.url, {
        method: 'POST',
        headers: collector.headers,
        body
      });
    } catch (error) {
      console.error('Error exporting log records:', error);
    }

    return { status: 'log record exported' };
  }

  async exportSpan(body: any, _sender: chrome.runtime.MessageSender) {
    try {
      const collector = collectorOptions('traces');
      fetch(collector.url, {
        method: 'POST',
        headers: collector.headers,
        body
      });
    } catch (error) {
      console.error('Error exporting spans:', error);
    }
    return { status: 'span exported' };
  }
}
