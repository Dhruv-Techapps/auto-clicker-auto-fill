import { LogRecord, logs } from '@opentelemetry/api-logs';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { bufferConfig, otlpLogExporter } from './exporter/otlp-exporter';
import { CoreLogger } from './logger';
import { resource } from './resource/open-telemetry-resource';

const processor = new BatchLogRecordProcessor(otlpLogExporter, bufferConfig);
const loggerProvider = new LoggerProvider({
  processors: [processor],
  resource
});
/* Initialize LoggerProvider */
logs.setGlobalLoggerProvider(loggerProvider);

const { version } = chrome.runtime.getManifest();
const backgroundLogger = logs.getLogger('background', version, {
  schemaUrl: 'https://opentelemetry.io/schemas/1.17.0',
  includeTraceContext: true
});

export class Logger extends CoreLogger {
  static override emit(logRecord: LogRecord) {
    backgroundLogger.emit(logRecord);
  }
}

export { ATTRIBUTE_ERROR_MESSAGE, ATTRIBUTE_ERROR_STACK, ATTRIBUTE_ERROR_TYPE } from './logger';
