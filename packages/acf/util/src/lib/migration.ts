import { IAction, IConfiguration, IUserScript } from '@dhruv-techapps/acf-common';

/**
 * Splits a legacy interval range string of the form "aeb" (e.g. "1e4") into its
 * numeric from/to parts.  Returns `undefined` when the value is not a string or
 * does not contain the separator.
 */
const splitIntervalRange = (value: unknown): { from: number; to: number } | undefined => {
  if (typeof value !== 'string') return undefined;
  const eIndex = value.indexOf('e');
  if (eIndex === -1) return undefined;
  const from = parseFloat(value.slice(0, eIndex));
  const to = parseFloat(value.slice(eIndex + 1));
  if (isNaN(from) || isNaN(to)) return undefined;
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
 *   - batch.repeatInterval       → batch.repeatInterval + batch.repeatIntervalTo
 *   - action.repeatInterval      → action.repeatInterval + action.repeatIntervalTo
 *   - action.settings.retryInterval → action.settings.retryInterval + action.settings.retryIntervalTo
 *   - action.addon.recheckInterval  → action.addon.recheckInterval + action.addon.recheckIntervalTo
 */
export const migrateConfigInterval = (config: IConfiguration): void => {
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
