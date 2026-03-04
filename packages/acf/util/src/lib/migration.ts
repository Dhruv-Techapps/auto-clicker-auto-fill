import { IAction, IConfiguration, ISettings, IUserScript } from '@dhruv-techapps/acf-common';

/**
 * Splits a legacy interval range string of the form "aeb" (e.g. "1e4") into its
 * numeric from/to parts.  Returns `undefined` when the value is not a string or
 * does not contain the separator.
 */
const splitIntervalRange = (value: unknown): { from: number; to: number } | undefined => {
  if (typeof value !== 'string') return undefined;
  const eIndex = value.indexOf('e');
  if (eIndex === -1) return undefined;
  const from = Number.parseFloat(value.slice(0, eIndex));
  const to = Number.parseFloat(value.slice(eIndex + 1));
  if (Number.isNaN(from) || Number.isNaN(to)) return undefined;
  return { from, to };
};

/**
 * Mutates a single configuration from legacy bounded sentinel -2 to 'unlimited'.
 * Targets: batch.repeat, action.repeat, action.settings.retry, action.addon.recheck
 */
export const migrateConfigBoundedLegacy = (config: IConfiguration): void => {
  // batch.repeat
  if (config.batch && (config.batch.repeat as unknown) === -2) {
    config.batch.repeat = 'unlimited';
  }

  // actions
  if (Array.isArray(config.actions)) {
    config.actions.forEach((action: IAction | IUserScript) => {
      if (action.type !== 'userscript') {
        if ((action.repeat as unknown) === -2) {
          action.repeat = 0;
        }

        if (action.settings && (action.settings.retry as unknown) === -2) {
          action.settings.retry = 'unlimited';
        }

        if (action.addon && (action.addon.recheck as unknown) === -2) {
          action.addon.recheck = 'unlimited';
        }
      }
    });
  }
};
/**
 * Runs all configuration migrations in order against a single config object.
 * Mutates the config in-place.
 */
export const migrateConfig = (config: IConfiguration): void => {
  migrateConfigBoundedLegacy(config);
  migrateConfigThen(config);
  migrateConfigInterval(config);
};

/**
 * Mutates settings: converts legacy sentinel -2 to 'unlimited' for retry.
 */
export const migrateSettingsBoundedLegacy = (settings: ISettings): void => {
  if ((settings.retry as unknown) === -2) {
    settings.retry = 'unlimited';
  }
};

/**
 * Mutates settings: splits legacy "aeb" range strings into from/to fields.
 * Targets: settings.retryInterval → settings.retryInterval + settings.retryIntervalTo
 */
export const migrateSettingsInterval = (settings: ISettings): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const split = splitIntervalRange((settings as any).retryInterval);
  if (split) {
    settings.retryInterval = split.from;
    settings.retryIntervalTo = split.to;
  }
};

/**
 * Runs all settings migrations in order against a single settings object.
 * Mutates the settings in-place.
 */
export const migrateSettings = (settings: ISettings): void => {
  migrateSettingsBoundedLegacy(settings);
  migrateSettingsInterval(settings);
};
/**
 * Mutates a single configuration's actions from the legacy `statement.then`
 * field to `statement.option`.
 */
export const migrateConfigThen = (config: IConfiguration): void => {
  if (!Array.isArray(config.actions)) return;

  config.actions.forEach((action: IAction | IUserScript) => {
    if (action.statement?.then !== undefined) {
      const { then: thenOption, option, ...restStatement } = action.statement as typeof action.statement & { then?: unknown };
      action.statement = {
        ...restStatement,
        option: option !== undefined ? option : (thenOption as typeof option)
      };
    }
  });
};

/**
 * Migrates interval fields that were previously stored as a legacy range string
 * of the form "aeb" (e.g. "1e4") to separate numeric from/to fields.
 *
 * Targets:
 *   - config.initWait               → config.initWait + config.initWaitTo
 *   - batch.repeatInterval          → batch.repeatInterval + batch.repeatIntervalTo
 *   - action.initWait               → action.initWait + action.initWaitTo
 *   - action.repeatInterval         → action.repeatInterval + action.repeatIntervalTo
 *   - action.settings.retryInterval → action.settings.retryInterval + action.settings.retryIntervalTo
 *   - action.addon.recheckInterval  → action.addon.recheckInterval + action.addon.recheckIntervalTo
 */
export const migrateConfigInterval = (config: IConfiguration): void => {
  // config.initWait
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configInitWaitSplit = splitIntervalRange((config as any).initWait);
  if (configInitWaitSplit) {
    config.initWait = configInitWaitSplit.from;
    config.initWaitTo = configInitWaitSplit.to;
  }

  // batch.repeatInterval
  if (config.batch) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const split = splitIntervalRange((config.batch as any).repeatInterval);
    if (split) {
      config.batch.repeatInterval = split.from;
      config.batch.repeatIntervalTo = split.to;
    }
  }

  // actions
  if (Array.isArray(config.actions)) {
    config.actions.forEach((action: IAction | IUserScript) => {
      if (action.type === 'userscript') return;

      const a = action as IAction;

      // action.initWait
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actionInitWaitSplit = splitIntervalRange((a as any).initWait);
      if (actionInitWaitSplit) {
        a.initWait = actionInitWaitSplit.from;
        a.initWaitTo = actionInitWaitSplit.to;
      }

      // repeatInterval
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const repeatSplit = splitIntervalRange((a as any).repeatInterval);
      if (repeatSplit) {
        a.repeatInterval = repeatSplit.from;
        a.repeatIntervalTo = repeatSplit.to;
      }

      // settings.retryInterval
      if (a.settings) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const retrySplit = splitIntervalRange((a.settings as any).retryInterval);
        if (retrySplit) {
          a.settings.retryInterval = retrySplit.from;
          a.settings.retryIntervalTo = retrySplit.to;
        }
      }

      // addon.recheckInterval
      if (a.addon) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recheckSplit = splitIntervalRange((a.addon as any).recheckInterval);
        if (recheckSplit) {
          a.addon.recheckInterval = recheckSplit.from;
          a.addon.recheckIntervalTo = recheckSplit.to;
        }
      }
    });
  }
};
