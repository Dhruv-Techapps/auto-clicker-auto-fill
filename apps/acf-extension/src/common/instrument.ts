import { BrowserClient, browserTracingIntegration, consoleLoggingIntegration, defaultStackParser, getDefaultIntegrations, makeFetchTransport, Scope } from '@sentry/browser';
import { RELEASE_VERSION, SENTRY_DSN, VARIANT } from './environments';

const scope = new Scope();
if (VARIANT === 'PROD' || VARIANT === 'LOCAL') {
  // filter integrations that use the global variable
  const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
    return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(defaultIntegration.name);
  });
  const client = new BrowserClient({
    dsn: SENTRY_DSN,
    environment: VARIANT,
    enableLogs: true,
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: [...integrations, browserTracingIntegration(), consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] })],
    ignoreErrors: [
      'The browser is shutting down.',
      'Extension context invalidated.',
      'Could not establish connection. Receiving end does not exist.',
      'Non-Error promise rejection captured',
      'unlabeled event'
    ],
    release: `acf-extension@${RELEASE_VERSION?.replace('v', '')}`,
    beforeSend: (event, hint) => {
      if (VARIANT === 'LOCAL') {
        console.log('SENTRY', event, hint);
        return null;
      }
      return event;
    },
    beforeSendLog: (log) => {
      if (log.level === 'info') {
        // Filter out all info logs
        return null;
      }
      return log;
    }
  });
  scope.setClient(client);
  client.init(); // initializing has to be done after setting the client on the scope
}

export { scope };
