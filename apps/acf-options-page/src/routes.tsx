import { createBrowserRouter } from 'react-router';
import { Layout } from './layout/layout';
import { AutomationLoopOffcanvas } from './offcanvas/automation-loop-offcanvas';
import { AutomationMonitorOffcanvas } from './offcanvas/automation-monitor-offcanvas';
import { AutomationScheduleOffcanvas } from './offcanvas/automation-schedule-offcanvas';
import { AutomationSettingsOffcanvas } from './offcanvas/automation-settings-offcanvas';
import { AutomationsReorderOffcanvas } from './offcanvas/automations-reorder-offcanvas';
import { PageGuardOffcanvas } from './offcanvas/page-guard-offcanvas';
import { StateGuardOffcanvas } from './offcanvas/state-guard-offcanvas';
import { AutomationStepSettingsOffcanvas } from './offcanvas/step-settings-offcanvas';
import { Automation } from './routes/automation';
import { Automations } from './routes/automations';
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
        path: 'automations',
        Component: () => <Automations />,
        children: [
          { index: true, Component: () => null },
          { path: 'reorder', Component: () => <AutomationsReorderOffcanvas show={true} /> },
          {
            path: ':automationId',
            Component: () => <Automation />,
            children: [
              { path: 'schedule', Component: () => <AutomationScheduleOffcanvas show={true} /> },
              { path: 'loop', Component: () => <AutomationLoopOffcanvas show={true} /> },
              { path: 'monitor', Component: () => <AutomationMonitorOffcanvas show={true} /> },
              { path: 'settings', Component: () => <AutomationSettingsOffcanvas show={true} /> },
              {
                path: ':stepId',
                children: [
                  { path: 'page-guard', Component: () => <PageGuardOffcanvas show={true} /> },
                  { path: 'state-guard', Component: () => <StateGuardOffcanvas show={true} /> },
                  { path: 'settings', Component: () => <AutomationStepSettingsOffcanvas show={true} /> }
                ]
              }
            ]
          }
        ]
      },
      SettingsRoutes
    ]
  }
]);
