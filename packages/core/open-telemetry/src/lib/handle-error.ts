import { Span, SpanStatusCode } from '@opentelemetry/api';
import { ATTRIBUTE_ERROR_MESSAGE, ATTRIBUTE_ERROR_STACK, ATTRIBUTE_ERROR_TYPE } from './logger';

type LoggerLike = {
  error: (message: string, meta?: Record<string, unknown>) => void;
};

export const handleError = (span: Span, event: unknown, message: string, attributes?: Record<string, unknown>, logger?: LoggerLike) => {
  const error: Error = event instanceof Error ? event : new Error(typeof event === 'string' ? event : JSON.stringify(event));
  span.recordException(error);
  span.setStatus({ code: SpanStatusCode.ERROR, message });
  span.addEvent('error', {
    [ATTRIBUTE_ERROR_TYPE]: error.name,
    [ATTRIBUTE_ERROR_MESSAGE]: error.message,
    [ATTRIBUTE_ERROR_STACK]: error.stack
  });
  const meta = {
    [ATTRIBUTE_ERROR_TYPE]: error.name,
    [ATTRIBUTE_ERROR_MESSAGE]: error.message,
    [ATTRIBUTE_ERROR_STACK]: error.stack,
    ...attributes
  };
  if (logger && typeof logger.error === 'function') {
    logger.error(message, meta);
  } else {
    // Fallback to console for environments without a provided logger
    // eslint-disable-next-line no-console
    console.error(message, meta);
  }
};
