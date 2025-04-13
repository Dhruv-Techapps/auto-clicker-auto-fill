import * as Sentry from '@sentry/react';

if (import.meta.env.VITE_PUBLIC_VARIANT === 'PROD') {
  Sentry.init({
    dsn: import.meta.env.VITE_PUBLIC_OPTIONS_PAGE_SENTRY_DSN,
    environment: import.meta.env.VITE_PUBLIC_VARIANT,
    release: `acf-options-page@${import.meta.env.VITE_PUBLIC_RELEASE_VERSION?.replace('v', '')}`,
    integrations: [Sentry.browserTracingIntegration()],
    ignoreErrors: ['Could not establish connection. Receiving end does not exist.'],
    debug: import.meta.env.VITE_PUBLIC_RELEASE_VERSION === 'v9.9.9',
    beforeSend: async (event, hint) => {
      const data = captureScreen();
      if (data) {
        hint.attachments = [{ filename: 'screenshot.png', data }];
      }
      return event;
    }
  });
}

function captureScreen() {
  // Create a canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set canvas dimensions to match the element
  const rect = document.documentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  if (context && document.documentElement.textContent) {
    // Draw the element on the canvas
    context.fillStyle = window.getComputedStyle(document.documentElement).backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(document.documentElement.textContent?.trim(), canvas.width / 2, canvas.height / 2);
    return canvas.toDataURL('image/png');
  }
  return '';
}
