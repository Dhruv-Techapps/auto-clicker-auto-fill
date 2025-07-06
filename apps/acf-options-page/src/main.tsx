import { ThemeProvider } from '@dhruv-techapps/ui-context';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/app';
import { store } from './store/store';
import './util/i18n';
import './util/instrument';

window.EXTENSION_ID = import.meta.env[`VITE_PUBLIC_CHROME_EXTENSION_ID`];

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
