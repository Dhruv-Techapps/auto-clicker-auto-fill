import { createBrowserRouter } from 'react-router';
import { Layout } from './layout/layout';
import { Configuration } from './routes/configuration';
import { ConfigurationScheduleOffcanvas } from './routes/configuration/configuration-schedule-offcanvas';
import { ConfigurationSettingsOffcanvas } from './routes/configuration/configuration-settings-offcanvas';
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
            Component: () => <Configuration />,
            children: [
              { path: 'settings', Component: () => <ConfigurationSettingsOffcanvas show={true} /> },
              { path: 'schedule', Component: () => <ConfigurationScheduleOffcanvas show={true} /> }
            ]
          }
        ]
      },
      SettingsRoutes
    ]
  }
]);
