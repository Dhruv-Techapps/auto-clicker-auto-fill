import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.scss';
import './instrument';
import { store } from './store';
import './util/i18n';

window.EXTENSION_ID = process.env[`NX_PUBLIC_CHROME_EXTENSION_ID`] ?? '';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
