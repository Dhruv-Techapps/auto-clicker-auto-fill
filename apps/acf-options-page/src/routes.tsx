import { createBrowserRouter } from 'react-router';
import { Layout } from './layout/layout';
import { ConfigurationBatchOffcanvas } from './offcanvas/configuration-batch-offcanvas';
import { ConfigurationScheduleOffcanvas } from './offcanvas/configuration-schedule-offcanvas';
import { ConfigurationSettingsOffcanvas } from './offcanvas/configuration-settings-offcanvas';
import { ConfigurationWatchOffcanvas } from './offcanvas/configuration-watch-offcanvas';
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
            Component: () => <Configuration />,
            children: [
              { path: 'settings', Component: () => <ConfigurationSettingsOffcanvas show={true} /> },
              { path: 'schedule', Component: () => <ConfigurationScheduleOffcanvas show={true} /> },
              { path: 'batch', Component: () => <ConfigurationBatchOffcanvas show={true} /> },
              { path: 'watch', Component: () => <ConfigurationWatchOffcanvas show={true} /> }
            ]
          }
        ]
      },
      SettingsRoutes
    ]
  }
]);
