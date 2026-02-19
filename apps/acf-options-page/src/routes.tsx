import { createBrowserRouter } from 'react-router';
import { Layout } from './layout/layout';
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
        Component: () => <Configurations />
      },
      /*{
        path: 'configurations/:configId',
        Component: () => <Config />,
        children: [
          {
            path: 'actions/:actionId',
            Component: () => <div>Action</div>
          }
        ]
      },*/
      SettingsRoutes
    ]
  }
]);
