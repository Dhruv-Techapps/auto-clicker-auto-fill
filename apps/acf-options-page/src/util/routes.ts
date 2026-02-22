/**
 * Centralized route definitions for type-safe navigation.
 * Use these constants everywhere instead of hardcoded path strings.
 * Changing a route path here will surface all broken usages as TypeScript errors.
 */

export const ROUTES = {
  HOME: '/',
  UPGRADE: '/upgrade',

  // Automations list
  AUTOMATIONS: '/automations',

  // Single automation — absolute path
  AUTOMATION: (automationId: string) => `/automations/${automationId}`,

  // Automation child routes — relative (used inside :automationId context)
  AUTOMATION_SETTINGS: 'settings',
  AUTOMATION_SCHEDULE: 'schedule',
  AUTOMATION_LOOP: 'loop',
  AUTOMATION_MONITOR: 'monitor',

  // Step child routes — relative (used inside :automationId/:stepId context)
  STEP_PRE_CHECK: (stepId: string) => `${stepId}/pre-check`,
  STEP_SETTINGS: (stepId: string) => `${stepId}/settings`,
  STEP_CONDITION: (stepId: string) => `${stepId}/condition`,

  // Settings
  SETTINGS: '/settings',
  SETTINGS_RETRY: '/settings/retry',
  SETTINGS_NOTIFICATION: '/settings/notification',
  SETTINGS_BACKUP: '/settings/backup',
  SETTINGS_GOOGLE_SHEETS: '/settings/google-sheets',
  SETTINGS_ADDITIONAL: '/settings/additional'
} as const;
