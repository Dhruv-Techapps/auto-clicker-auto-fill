import { LogRecord, logs } from '@opentelemetry/api-logs';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { ServiceWorkerLogExporter } from './exporter/service-worker';
import { CoreLogger } from './logger';
import { resource } from './resource/open-telemetry-resource';

const serviceWorkerProcessor = new SimpleLogRecordProcessor(new ServiceWorkerLogExporter());
const loggerProvider = new LoggerProvider({
  processors: [serviceWorkerProcessor],
  resource
});

/* Initialize LoggerProvider */
logs.setGlobalLoggerProvider(loggerProvider);

const { version } = chrome.runtime.getManifest();
export const logger = logs.getLogger('content-script', version, {
  schemaUrl: 'https://opentelemetry.io/schemas/1.17.0',
  includeTraceContext: true
});

export class Logger extends CoreLogger {
  static override emit(logRecord: LogRecord) {
    logger.emit(logRecord);
  }
}
export { ATTRIBUTE_ERROR_MESSAGE, ATTRIBUTE_ERROR_STACK, ATTRIBUTE_ERROR_TYPE } from './logger';
