import { ThemeProvider } from '@acf-options-page/context';
import { setupTelemetry } from '@dhruv-techapps/core-open-telemetry/options-page';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/app';
import { store } from './store/store';
import './util/i18n';

setupTelemetry({
  'service.version': import.meta.env.VITE_PUBLIC_RELEASE_VERSION
});

window.core = window.core || {};
window.core.__productName = 'options-page';
window.core.__extensionId = import.meta.env.VITE_PUBLIC_CHROME_EXTENSION_ID;
window.core.__releaseVersion = import.meta.env.VITE_PUBLIC_RELEASE_VERSION;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
