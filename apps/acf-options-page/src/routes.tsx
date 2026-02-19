import { createBrowserRouter } from 'react-router';
import { Layout } from './layout/layout';
import { Configuration } from './routes/configuration';
import { Configurations } from './routes/configurations';
import { Home } from './routes/home';
import { SettingsRoutes } from './routes/settings/settings-route';
import { Upgrade } from './routes/upgrade';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, Component: Home },
      {
        path: 'upgrade',
        Component: () => <Upgrade />
      },
      {
        path: 'configurations',
        children: [
          { index: true, Component: () => <Configurations /> },
          {
            path: ':configId',
            Component: () => <Configuration />
          }
        ]
      },
      SettingsRoutes
    ]
  }
]);
