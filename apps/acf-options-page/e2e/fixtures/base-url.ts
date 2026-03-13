export const BASE_URL = process.env['VITE_PUBLIC_URL'];

export const URLS = {
  HOME: `${BASE_URL}/`,
  UPGRADE: `${BASE_URL}/upgrade`,

  // Automations list
  AUTOMATIONS: `${BASE_URL}/automations`,
  AUTOMATIONS_REORDER: `${BASE_URL}/automations/reorder`,

  // Single automation — pass an automationId
  AUTOMATION: (automationId: string) => `${BASE_URL}/automations/${automationId}`,

  // Automation child routes — pass an automationId
  AUTOMATION_SETTINGS: (automationId: string) => `${BASE_URL}/automations/${automationId}/settings`,
  AUTOMATION_SCHEDULE: (automationId: string) => `${BASE_URL}/automations/${automationId}/schedule`,
  AUTOMATION_LOOP: (automationId: string) => `${BASE_URL}/automations/${automationId}/loop`,
  AUTOMATION_MONITOR: (automationId: string) => `${BASE_URL}/automations/${automationId}/monitor`,

  // Step child routes — pass automationId and stepId
  PAGE_GUARD: (automationId: string, stepId: string) => `${BASE_URL}/automations/${automationId}/${stepId}/page-guard`,
  STATE_GUARD: (automationId: string, stepId: string) => `${BASE_URL}/automations/${automationId}/${stepId}/state-guard`,
  STEP_SETTINGS: (automationId: string, stepId: string) => `${BASE_URL}/automations/${automationId}/${stepId}/settings`,

  // Settings
  SETTINGS: `${BASE_URL}/settings`,
  SETTINGS_RETRY: `${BASE_URL}/settings/retry`,
  SETTINGS_NOTIFICATION: `${BASE_URL}/settings/notification`,
  SETTINGS_BACKUP: `${BASE_URL}/settings/backup`,
  SETTINGS_GOOGLE_SHEETS: `${BASE_URL}/settings/google-sheets`,
  SETTINGS_ADDITIONAL: `${BASE_URL}/settings/additional`
};
