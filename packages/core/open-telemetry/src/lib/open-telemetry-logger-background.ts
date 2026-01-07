import { LogRecord, logs } from '@opentelemetry/api-logs';
import { ConsoleLogRecordExporter, LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { otlpLogExporter } from './exporter/otlp-exporter';
import { CoreLogger } from './logger';
import { resource } from './resource/open-telemetry-resource';

const processor = new SimpleLogRecordProcessor(otlpLogExporter);
const consoleProcessor = new SimpleLogRecordProcessor(new ConsoleLogRecordExporter());
const loggerProvider = new LoggerProvider({
  processors: [consoleProcessor, processor],
  resource
});
/* Initialize LoggerProvider */
logs.setGlobalLoggerProvider(loggerProvider);

const { version } = chrome.runtime.getManifest();
export const logger = logs.getLogger('background', version, {
  schemaUrl: 'https://opentelemetry.io/schemas/1.17.0',
  includeTraceContext: true
});

export class Logger extends CoreLogger {
  static override emit(logRecord: LogRecord) {
    logger.emit(logRecord);
  }
}

export { ATTRIBUTE_ERROR_MESSAGE, ATTRIBUTE_ERROR_STACK, ATTRIBUTE_ERROR_TYPE } from './logger';
