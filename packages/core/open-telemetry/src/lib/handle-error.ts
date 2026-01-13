import { Span, SpanStatusCode } from '@opentelemetry/api';
import { AnyValueMap } from '@opentelemetry/api-logs';
import { ATTRIBUTE_ERROR_MESSAGE, ATTRIBUTE_ERROR_STACK, ATTRIBUTE_ERROR_TYPE, CoreLogger } from './logger';

export const handleError = (span: Span, event: unknown, message: string, logger: typeof CoreLogger.error, attributes?: AnyValueMap) => {
  const error: Error = event instanceof Error ? event : new Error(typeof event === 'string' ? event : JSON.stringify(event));
  const errorAttribute = {
    [ATTRIBUTE_ERROR_TYPE]: error.name,
    [ATTRIBUTE_ERROR_MESSAGE]: error.message,
    [ATTRIBUTE_ERROR_STACK]: error.stack || 'N/A'
  };
  span.recordException(error);
  span.setStatus({ code: SpanStatusCode.ERROR, message });

  attributes = {
    ...errorAttribute,
    ...attributes
  };
  logger(message, error, attributes);
};
