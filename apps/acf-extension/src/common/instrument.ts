import { BrowserClient, browserTracingIntegration, captureConsoleIntegration, defaultStackParser, getDefaultIntegrations, makeFetchTransport, Scope } from '@sentry/browser';
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
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: [
      ...integrations,
      browserTracingIntegration(),
      captureConsoleIntegration({
        levels: ['error', 'warn'],
      }),
    ],
    ignoreErrors: [
      'The browser is shutting down.',
      'Extension context invalidated.',
      'Could not establish connection. Receiving end does not exist.',
      'Non-Error promise rejection captured',
      'unlabeled event',
    ],
    release: `acf-extension@${RELEASE_VERSION?.replace('v', '')}`,
    sampleRate: 1,
    tracesSampleRate: 1.0,
    beforeSend: (event, hint) => {
      if (VARIANT === 'LOCAL') {
        console.log('SENTRY', event, hint);
        return null;
      }
      return event;
    },
  });
  scope.setClient(client);
  client.init(); // initializing has to be done after setting the client on the scope
}

export { scope };
