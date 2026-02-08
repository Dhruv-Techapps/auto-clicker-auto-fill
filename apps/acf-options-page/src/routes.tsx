import { createBrowserRouter, Navigate } from 'react-router';
import { SettingNotifications } from './modal/settings/notifications';
import { Config } from './new-app/components/config';
import { Home } from './new-app/components/home';
import { Search } from './new-app/components/search';
import { Settings } from './new-app/components/settings';
import { AdditionalSettings } from './new-app/components/settings/additional';
import { SettingsGeneral } from './new-app/components/settings/general';
import { SettingsGoogleBackup } from './new-app/components/settings/google-backup';
import { SettingGoogleSheets } from './new-app/components/settings/google-sheets';
import { SettingRetry } from './new-app/components/settings/retry';
import { Layout } from './new-app/layout';

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
        path: 'config/:id',
        Component: () => <Config />
      },
      {
        path: 'settings',
        Component: Settings,
        children: [
          { index: true, Component: () => <Navigate to='general' replace /> },
          { path: 'general', Component: () => <SettingsGeneral /> },
          { path: 'notification', Component: () => <SettingNotifications /> },
          { path: 'retry', Component: () => <SettingRetry /> },
          { path: 'backup', Component: () => <SettingsGoogleBackup /> },
          { path: 'google-sheets', Component: () => <SettingGoogleSheets /> },
          { path: 'additional', Component: () => <AdditionalSettings /> }
        ]
      }
    ]
  }
]);
