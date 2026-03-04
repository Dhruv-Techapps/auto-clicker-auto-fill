import { EErrorOptions } from '@dhruv-techapps/acf-common';
import { migrateConfig, migrateConfigBoundedLegacy, migrateConfigInterval, migrateConfigThen, migrateSettings, migrateSettingsBoundedLegacy, migrateSettingsInterval } from './migration';

// ─── helpers ────────────────────────────────────────────────────────────────

const makeAction = (overrides: Record<string, unknown> = {}) => ({
  type: 'action' as const,
  id: 'action-1',
  elementFinder: '#btn',
  ...overrides
});

const makeUserScript = (overrides: Record<string, unknown> = {}) => ({
  type: 'userscript' as const,
  id: 'us-1',
  ...overrides
});

const makeConfig = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'config-1',
    url: 'https://example.com',
    enable: true,
    startType: 'auto',
    loadType: 'window',
    actions: [makeAction()],
    ...overrides
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

const makeSettings = (overrides: Record<string, unknown> = {}) =>
  ({
    retry: 5,
    retryInterval: 1,
    retryOption: EErrorOptions.STOP,
    checkiFrames: false,
    statusBar: 'bottom-right',
    ...overrides
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any;

// ─── migrateConfigBoundedLegacy ─────────────────────────────────────────────

describe('migrateConfigBoundedLegacy', () => {
  it('should convert batch.repeat -2 to unlimited', () => {
    const config = makeConfig({ batch: { repeat: -2 } });

    migrateConfigBoundedLegacy(config);

    expect(config.batch.repeat).toBe('unlimited');
  });

  it('should leave batch.repeat unchanged when not -2', () => {
    const config = makeConfig({ batch: { repeat: 3 } });

    migrateConfigBoundedLegacy(config);

    expect(config.batch.repeat).toBe(3);
  });

  it('should convert action.repeat -2 to 0', () => {
    const config = makeConfig({ actions: [makeAction({ repeat: -2 })] });

    migrateConfigBoundedLegacy(config);

    expect(config.actions[0].repeat).toBe(0);
  });

  it('should leave action.repeat unchanged when not -2', () => {
    const config = makeConfig({ actions: [makeAction({ repeat: 5 })] });

    migrateConfigBoundedLegacy(config);

    expect(config.actions[0].repeat).toBe(5);
  });

  it('should convert action.settings.retry -2 to unlimited', () => {
    const config = makeConfig({ actions: [makeAction({ settings: { retry: -2 } })] });

    migrateConfigBoundedLegacy(config);

    expect(config.actions[0].settings.retry).toBe('unlimited');
  });

  it('should leave action.settings.retry unchanged when not -2', () => {
    const config = makeConfig({ actions: [makeAction({ settings: { retry: 3 } })] });

    migrateConfigBoundedLegacy(config);

    expect(config.actions[0].settings.retry).toBe(3);
  });

  it('should convert action.addon.recheck -2 to unlimited', () => {
    const config = makeConfig({ actions: [makeAction({ addon: { recheck: -2 } })] });

    migrateConfigBoundedLegacy(config);

    expect(config.actions[0].addon.recheck).toBe('unlimited');
  });

  it('should leave action.addon.recheck unchanged when not -2', () => {
    const config = makeConfig({ actions: [makeAction({ addon: { recheck: 5 } })] });

    migrateConfigBoundedLegacy(config);

    expect(config.actions[0].addon.recheck).toBe(5);
  });

  it('should skip userscript actions entirely', () => {
    const userscript = makeUserScript({ repeat: -2, settings: { retry: -2 } });
    const config = makeConfig({ actions: [userscript] });

    migrateConfigBoundedLegacy(config);

    expect(config.actions[0].repeat).toBe(-2);
    expect(config.actions[0].settings.retry).toBe(-2);
  });

  it('should migrate all actions in a mixed config', () => {
    const config = makeConfig({
      batch: { repeat: -2 },
      actions: [makeAction({ repeat: -2, settings: { retry: -2 }, addon: { recheck: -2 } }), makeAction({ repeat: 1 })]
    });

    migrateConfigBoundedLegacy(config);

    expect(config.batch.repeat).toBe('unlimited');
    expect(config.actions[0].repeat).toBe(0);
    expect(config.actions[0].settings.retry).toBe('unlimited');
    expect(config.actions[0].addon.recheck).toBe('unlimited');
    expect(config.actions[1].repeat).toBe(1);
  });
});

// ─── migrateConfigThen ──────────────────────────────────────────────────────

describe('migrateConfigThen', () => {
  it('should move statement.then to statement.option when option is absent', () => {
    const config = makeConfig({
      actions: [
        makeAction({
          statement: { conditions: [], then: EErrorOptions.SKIP }
        })
      ]
    });

    migrateConfigThen(config);

    expect(config.actions[0].statement.option).toBe(EErrorOptions.SKIP);
    expect(config.actions[0].statement.then).toBeUndefined();
  });

  it('should keep existing statement.option when both then and option are present', () => {
    const config = makeConfig({
      actions: [
        makeAction({
          statement: { conditions: [], then: EErrorOptions.SKIP, option: EErrorOptions.STOP }
        })
      ]
    });

    migrateConfigThen(config);

    expect(config.actions[0].statement.option).toBe(EErrorOptions.STOP);
    expect(config.actions[0].statement.then).toBeUndefined();
  });

  it('should leave actions without statement.then unchanged', () => {
    const config = makeConfig({
      actions: [makeAction({ statement: { conditions: [], option: EErrorOptions.STOP } })]
    });

    migrateConfigThen(config);

    expect(config.actions[0].statement.option).toBe(EErrorOptions.STOP);
  });

  it('should leave actions with no statement unchanged', () => {
    const config = makeConfig({ actions: [makeAction()] });

    migrateConfigThen(config);

    expect(config.actions[0].statement).toBeUndefined();
  });

  it('should migrate multiple actions independently', () => {
    const config = makeConfig({
      actions: [makeAction({ id: 'a1', statement: { conditions: [], then: EErrorOptions.SKIP } }), makeAction({ id: 'a2', statement: { conditions: [], then: EErrorOptions.RELOAD } })]
    });

    migrateConfigThen(config);

    expect(config.actions[0].statement.option).toBe(EErrorOptions.SKIP);
    expect(config.actions[1].statement.option).toBe(EErrorOptions.RELOAD);
  });

  it('should do nothing when actions array is empty', () => {
    const config = makeConfig({ actions: [] });

    migrateConfigThen(config);

    expect(config.actions).toHaveLength(0);
  });
});

// ─── migrateConfigInterval ──────────────────────────────────────────────────

describe('migrateConfigInterval', () => {
  it('should split batch.repeatInterval "aeb" string into from and to', () => {
    const config = makeConfig({ batch: { repeatInterval: '1e4' } });

    migrateConfigInterval(config);

    expect(config.batch.repeatInterval).toBe(1);
    expect(config.batch.repeatIntervalTo).toBe(4);
  });

  it('should leave batch.repeatInterval unchanged when it is a number', () => {
    const config = makeConfig({ batch: { repeatInterval: 2 } });

    migrateConfigInterval(config);

    expect(config.batch.repeatInterval).toBe(2);
    expect(config.batch.repeatIntervalTo).toBeUndefined();
  });

  it('should split action.repeatInterval "aeb" string into from and to', () => {
    const config = makeConfig({ actions: [makeAction({ repeatInterval: '0.5e2' })] });

    migrateConfigInterval(config);

    expect(config.actions[0].repeatInterval).toBe(0.5);
    expect(config.actions[0].repeatIntervalTo).toBe(2);
  });

  it('should leave action.repeatInterval unchanged when it is a number', () => {
    const config = makeConfig({ actions: [makeAction({ repeatInterval: 3 })] });

    migrateConfigInterval(config);

    expect(config.actions[0].repeatInterval).toBe(3);
    expect(config.actions[0].repeatIntervalTo).toBeUndefined();
  });

  it('should split action.settings.retryInterval "aeb" string into from and to', () => {
    const config = makeConfig({ actions: [makeAction({ settings: { retryInterval: '1e10' } })] });

    migrateConfigInterval(config);

    expect(config.actions[0].settings.retryInterval).toBe(1);
    expect(config.actions[0].settings.retryIntervalTo).toBe(10);
  });

  it('should leave action.settings.retryInterval unchanged when it is a number', () => {
    const config = makeConfig({ actions: [makeAction({ settings: { retryInterval: 1 } })] });

    migrateConfigInterval(config);

    expect(config.actions[0].settings.retryInterval).toBe(1);
    expect(config.actions[0].settings.retryIntervalTo).toBeUndefined();
  });

  it('should split action.addon.recheckInterval "aeb" string into from and to', () => {
    const config = makeConfig({ actions: [makeAction({ addon: { recheckInterval: '2e5' } })] });

    migrateConfigInterval(config);

    expect(config.actions[0].addon.recheckInterval).toBe(2);
    expect(config.actions[0].addon.recheckIntervalTo).toBe(5);
  });

  it('should leave action.addon.recheckInterval unchanged when it is a number', () => {
    const config = makeConfig({ actions: [makeAction({ addon: { recheckInterval: 2 } })] });

    migrateConfigInterval(config);

    expect(config.actions[0].addon.recheckInterval).toBe(2);
    expect(config.actions[0].addon.recheckIntervalTo).toBeUndefined();
  });

  it('should skip userscript actions', () => {
    const config = makeConfig({ actions: [makeUserScript({ repeatInterval: '1e5' })] });

    migrateConfigInterval(config);

    expect(config.actions[0].repeatInterval).toBe('1e5');
    expect(config.actions[0].repeatIntervalTo).toBeUndefined();
  });

  it('should not set to field when interval string has no "e"', () => {
    const config = makeConfig({ batch: { repeatInterval: '3' } });

    migrateConfigInterval(config);

    expect(config.batch.repeatInterval).toBe('3');
    expect(config.batch.repeatIntervalTo).toBeUndefined();
  });

  it('should migrate all interval fields at once', () => {
    const config = makeConfig({
      batch: { repeatInterval: '1e3' },
      actions: [
        makeAction({
          repeatInterval: '2e4',
          settings: { retryInterval: '0.5e1' },
          addon: { recheckInterval: '3e6' }
        })
      ]
    });

    migrateConfigInterval(config);

    expect(config.batch.repeatInterval).toBe(1);
    expect(config.batch.repeatIntervalTo).toBe(3);
    expect(config.actions[0].repeatInterval).toBe(2);
    expect(config.actions[0].repeatIntervalTo).toBe(4);
    expect(config.actions[0].settings.retryInterval).toBe(0.5);
    expect(config.actions[0].settings.retryIntervalTo).toBe(1);
    expect(config.actions[0].addon.recheckInterval).toBe(3);
    expect(config.actions[0].addon.recheckIntervalTo).toBe(6);
  });
});

// ─── migrateConfig (composite) ──────────────────────────────────────────────

describe('migrateConfig', () => {
  it('should run all three config migrations in order', () => {
    const config = makeConfig({
      batch: { repeat: -2, repeatInterval: '1e5' },
      actions: [
        makeAction({
          repeat: -2,
          repeatInterval: '2e6',
          settings: { retry: -2, retryInterval: '0.5e2' },
          addon: { recheck: -2, recheckInterval: '1e4' },
          statement: { conditions: [], then: EErrorOptions.SKIP }
        })
      ]
    });

    migrateConfig(config);

    // bounded legacy
    expect(config.batch.repeat).toBe('unlimited');
    expect(config.actions[0].repeat).toBe(0);
    expect(config.actions[0].settings.retry).toBe('unlimited');
    expect(config.actions[0].addon.recheck).toBe('unlimited');
    // then → option
    expect(config.actions[0].statement.option).toBe(EErrorOptions.SKIP);
    expect(config.actions[0].statement.then).toBeUndefined();
    // intervals
    expect(config.batch.repeatInterval).toBe(1);
    expect(config.batch.repeatIntervalTo).toBe(5);
    expect(config.actions[0].repeatInterval).toBe(2);
    expect(config.actions[0].repeatIntervalTo).toBe(6);
    expect(config.actions[0].settings.retryInterval).toBe(0.5);
    expect(config.actions[0].settings.retryIntervalTo).toBe(2);
    expect(config.actions[0].addon.recheckInterval).toBe(1);
    expect(config.actions[0].addon.recheckIntervalTo).toBe(4);
  });

  it('should be a no-op on a clean config with no legacy values', () => {
    const config = makeConfig({
      actions: [makeAction({ repeat: 2, repeatInterval: 1, settings: { retry: 3 } })]
    });
    const snapshot = JSON.stringify(config);

    migrateConfig(config);

    expect(JSON.stringify(config)).toBe(snapshot);
  });
});

// ─── migrateSettingsBoundedLegacy ───────────────────────────────────────────

describe('migrateSettingsBoundedLegacy', () => {
  it('should convert settings.retry -2 to unlimited', () => {
    const settings = makeSettings({ retry: -2 });

    migrateSettingsBoundedLegacy(settings);

    expect(settings.retry).toBe('unlimited');
  });

  it('should leave settings.retry unchanged when not -2', () => {
    const settings = makeSettings({ retry: 5 });

    migrateSettingsBoundedLegacy(settings);

    expect(settings.retry).toBe(5);
  });

  it('should leave settings.retry unchanged when it is already unlimited string', () => {
    const settings = makeSettings({ retry: 'unlimited' });

    migrateSettingsBoundedLegacy(settings);

    expect(settings.retry).toBe('unlimited');
  });
});

// ─── migrateSettingsInterval ────────────────────────────────────────────────

describe('migrateSettingsInterval', () => {
  it('should split settings.retryInterval "aeb" string into from and to', () => {
    const settings = makeSettings({ retryInterval: '1e5' });

    migrateSettingsInterval(settings);

    expect(settings.retryInterval).toBe(1);
    expect(settings.retryIntervalTo).toBe(5);
  });

  it('should leave settings.retryInterval unchanged when it is a number', () => {
    const settings = makeSettings({ retryInterval: 2 });

    migrateSettingsInterval(settings);

    expect(settings.retryInterval).toBe(2);
    expect(settings.retryIntervalTo).toBeUndefined();
  });

  it('should handle decimal "from" value in range string', () => {
    const settings = makeSettings({ retryInterval: '0.5e3' });

    migrateSettingsInterval(settings);

    expect(settings.retryInterval).toBe(0.5);
    expect(settings.retryIntervalTo).toBe(3);
  });

  it('should not set retryIntervalTo when interval string has no "e"', () => {
    const settings = makeSettings({ retryInterval: '3' });

    migrateSettingsInterval(settings);

    expect(settings.retryIntervalTo).toBeUndefined();
  });
});

// ─── migrateSettings (composite) ────────────────────────────────────────────

describe('migrateSettings', () => {
  it('should run both settings migrations', () => {
    const settings = makeSettings({ retry: -2, retryInterval: '1e5' });

    migrateSettings(settings);

    expect(settings.retry).toBe('unlimited');
    expect(settings.retryInterval).toBe(1);
    expect(settings.retryIntervalTo).toBe(5);
  });

  it('should be a no-op on clean settings', () => {
    const settings = makeSettings({ retry: 5, retryInterval: 1 });
    const snapshot = JSON.stringify(settings);

    migrateSettings(settings);

    expect(JSON.stringify(settings)).toBe(snapshot);
  });
});
