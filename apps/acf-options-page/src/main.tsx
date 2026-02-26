import { ThemeProvider } from '@acf-options-page/context';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router/dom';
import { router } from './routes';
import { store } from './store/store';
import './util/i18n';

window.EXTENSION_ID = import.meta.env[`VITE_PUBLIC_CHROME_EXTENSION_ID`];

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
