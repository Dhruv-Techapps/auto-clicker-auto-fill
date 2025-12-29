import { logger, trace } from '@dhruv-techapps/core-open-telemetry';

self.onunhandledrejection = async (event) => {
  const tracer = trace.getTracer('service-worker');
  const span = tracer.startSpan('unhandled_promise_rejection', {
    attributes: {
      'error.type': 'unhandledrejection',
      'error.origin': 'service-worker'
    }
  });

  try {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    // 1️⃣ Attach error to trace
    span.recordException(error);
    span.setStatus({
      code: 2, // SpanStatusCode.ERROR
      message: error.message
    });
  } finally {
    span.end();
  }
};

self.onerror = (message: string | Event, source?: string, lineno?: number, colno?: number, error?: Error) => {
  const tracer = trace.getTracer('service-worker');
  const span = tracer.startSpan('unhandled_js_error', {
    attributes: {
      'error.type': 'onerror',
      'error.origin': 'service-worker',
      'error.source': source,
      'code.lineno': lineno,
      'code.colno': colno
    }
  });

  try {
    const err = error instanceof Error ? error : new Error(typeof message === 'string' ? message : 'Unknown error');

    // 1️⃣ Attach error to trace
    span.recordException(err);
    span.setStatus({
      code: 2, // SpanStatusCode.ERROR
      message: err.message
    });

    // 2️⃣ Emit structured log
    logger.emit({
      severityText: 'ERROR',
      body: 'Unhandled JavaScript error',
      attributes: {
        'error.message': err.message,
        'error.stack': err.stack,
        'error.source': source,
        'code.lineno': lineno,
        'code.colno': colno
      }
    });
  } finally {
    span.end();
  }

  // Return false → allow default browser handling (recommended)
  return false;
};
