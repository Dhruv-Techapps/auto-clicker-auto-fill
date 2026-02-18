import { Navigate } from 'react-router';
import { AdditionalSettings } from './additional';
import { SettingsGeneral } from './general';
import { SettingsGoogleBackup } from './google-backup';
import { SettingGoogleSheets } from './google-sheets';
import { SettingNotifications } from './notifications';
import { SettingRetry } from './retry';
import { Settings } from './settings';

export const SettingsRoutes = {
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
};
