import { createBrowserRouter } from 'react-router';
import { Layout } from './layout/layout';
import { Config } from './routes/config';
import { Home } from './routes/home';
import { Search } from './routes/search';
import { SettingsRoutes } from './routes/settings/settings-route';
import { Upgrade } from './routes/upgrade';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, Component: Home },
      {
        path: 'search',
        Component: Search
      },
      {
        path: 'upgrade',
        Component: () => <Upgrade />
      },
      {
        path: 'config/:configId',
        Component: () => <Config />,
        children: [
          {
            path: 'action/:actionId',
            Component: () => <div>Action</div>
          }
        ]
      },
      SettingsRoutes
    ]
  }
]);
