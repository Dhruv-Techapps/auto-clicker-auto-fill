import { createBrowserRouter } from 'react-router';
import { Layout } from './layout/layout';
import { AutomationLoopOffcanvas } from './offcanvas/automation-loop-offcanvas';
import { AutomationMonitorOffcanvas } from './offcanvas/automation-monitor-offcanvas';
import { AutomationScheduleOffcanvas } from './offcanvas/automation-schedule-offcanvas';
import { AutomationSettingsOffcanvas } from './offcanvas/automation-settings-offcanvas';
import { StepConditionOffcanvas } from './offcanvas/step-condition-offcanvas';
import { StepPreCheckOffcanvas } from './offcanvas/step-prec-check-offcanvas';
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
        children: [
          { index: true, Component: () => <Automations /> },
          {
            path: ':automationId',
            Component: () => <Automation />,
            children: [
              { path: 'settings', Component: () => <AutomationSettingsOffcanvas show={true} /> },
              { path: 'schedule', Component: () => <AutomationScheduleOffcanvas show={true} /> },
              { path: 'loop', Component: () => <AutomationLoopOffcanvas show={true} /> },
              { path: 'monitor', Component: () => <AutomationMonitorOffcanvas show={true} /> },
              {
                path: ':stepId',
                children: [
                  { path: 'pre-check', Component: () => <StepPreCheckOffcanvas show={true} /> },
                  { path: 'settings', Component: () => <AutomationStepSettingsOffcanvas show={true} /> },
                  { path: 'condition', Component: () => <StepConditionOffcanvas show={true} /> }
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
