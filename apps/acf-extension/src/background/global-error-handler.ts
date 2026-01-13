import { context, handleFatalError, trace, tracer } from '@dhruv-techapps/core-open-telemetry/background';
// Register handlers IMMEDIATELY during initial script evaluation
self.onunhandledrejection = async (event) => {
  try {
    const activeCtx = context.active();
    const activeSpan = trace.getSpan(activeCtx);

    // CASE 1: attach to existing span
    if (activeSpan) {
      handleFatalError(activeSpan, event.reason, 'Unhandled Promise Rejection');
      return;
    }

    const span = tracer.startSpan('unhandled_promise_rejection');
    handleFatalError(span, event.reason, 'Unhandled Promise Rejection');
    span.end();
  } catch (e) {
    console.error('Error in self.onunhandledrejection handler', e);
  }
};

self.onerror = (message: string | Event, source?: string, lineno?: number, colno?: number, error?: Error) => {
  try {
    // Use dynamic import to avoid blocking initial registration

    const activeCtx = context.active();
    const activeSpan = trace.getSpan(activeCtx);

    // CASE 1: attach to existing span
    if (activeSpan) {
      handleFatalError(activeSpan, error ?? message, 'Global Error Handler', {
        'error.source': source,
        'code.lineno': lineno,
        'code.colno': colno
      });
      return;
    }

    const span = tracer.startSpan('global_error_handler');
    handleFatalError(span, error ?? message, 'Global Error Handler', {
      'error.source': source,
      'code.lineno': lineno,
      'code.colno': colno
    });
    span.end();
  } catch (error) {
    console.error('Error in self.onerror handler', error);
  }

  // Return false → allow default browser handling
  return false;
};
