import { EConfigSource, IBatch, IConfiguration, ISchedule, IWatchSettings, getDefaultAction, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { describe, expect, it, vi } from 'vitest';
import {
  ConfigStore,
  addAction,
  addConfig,
  configReducer,
  duplicateConfig,
  importConfigs,
  removeAction,
  removeConfigs,
  reorderActions,
  reorderConfigs,
  setConfigError,
  setConfigMessage,
  setConfigs,
  setDetailVisibility,
  setSearch,
  syncActionAddon,
  syncActionSettings,
  syncActionStatement,
  syncBatch,
  syncSchedule,
  syncWatch,
  updateAction,
  updateConfig
} from './config.slice';

// Mock LocalStorage to avoid jsdom localStorage issues with the slice initializer
vi.mock('@acf-options-page/_helpers', () => ({
  LocalStorage: {
    getItem: vi.fn((_key: string, fallback: unknown) => fallback),
    setItem: vi.fn()
  }
}));

// Mock CONFIGURATIONS data so initialState.configs starts empty
vi.mock('@acf-options-page/data/configurations', () => ({
  CONFIGURATIONS: []
}));

function makeInitialState(configs: IConfiguration[] = []): ConfigStore {
  return {
    loading: false,
    configs,
    detailVisibility: { name: true, url: true }
  };
}

function makeConfig(overrides: Partial<IConfiguration> = {}): IConfiguration {
  return {
    ...getDefaultConfig(EConfigSource.WEB),
    ...overrides
  };
}

describe('config slice – basic config management', () => {
  it('should return initial state', () => {
    const state = configReducer(undefined, { type: '@@INIT' });
    expect(state).toHaveProperty('loading');
    expect(state).toHaveProperty('configs');
    expect(Array.isArray(state.configs)).toBe(true);
  });

  it('addConfig should prepend a new config', () => {
    const state = makeInitialState();
    const nextState = configReducer(state, addConfig());
    expect(nextState.configs).toHaveLength(1);
    expect(nextState.configs[0].id).toBeDefined();
    expect(nextState.configs[0].enable).toBe(true);
  });

  it('addConfig should prepend (not append) to existing configs', () => {
    const existing = makeConfig({ url: 'https://existing.com' });
    const state = makeInitialState([existing]);
    const nextState = configReducer(state, addConfig());
    expect(nextState.configs).toHaveLength(2);
    expect(nextState.configs[0].url).toBe(''); // new config at index 0
    expect(nextState.configs[1].url).toBe('https://existing.com');
  });

  it('updateConfig should update fields on matching config', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const nextState = configReducer(state, updateConfig({ configId: config.id, url: 'https://updated.com' }));
    expect(nextState.configs[0].url).toBe('https://updated.com');
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('updateConfig should set error when configId not found', () => {
    const state = makeInitialState([makeConfig()]);
    const nextState = configReducer(state, updateConfig({ configId: 'nonexistent-id' as any, url: 'x' }));
    expect(nextState.error).toBe('Invalid Configuration');
  });

  it('removeConfigs should remove configs by id', () => {
    const c1 = makeConfig();
    const c2 = makeConfig();
    const state = makeInitialState([c1, c2]);
    const nextState = configReducer(state, removeConfigs([c1.id]));
    expect(nextState.configs).toHaveLength(1);
    expect(nextState.configs[0].id).toBe(c2.id);
  });

  it('removeConfigs should remove multiple configs', () => {
    const c1 = makeConfig();
    const c2 = makeConfig();
    const c3 = makeConfig();
    const state = makeInitialState([c1, c2, c3]);
    const nextState = configReducer(state, removeConfigs([c1.id, c3.id]));
    expect(nextState.configs).toHaveLength(1);
    expect(nextState.configs[0].id).toBe(c2.id);
  });

  it('duplicateConfig should add a copy with a new id', () => {
    const config = makeConfig({ url: 'https://test.com', name: 'Test Config' });
    const state = makeInitialState([config]);
    const nextState = configReducer(state, duplicateConfig(config.id));
    expect(nextState.configs).toHaveLength(2);
    const duplicate = nextState.configs.find((c) => c.id !== config.id);
    expect(duplicate).toBeDefined();
    expect(duplicate!.name).toContain('(Duplicate)');
    expect(duplicate!.url).toBe('https://test.com');
  });

  it('duplicateConfig should set error when configId not found', () => {
    const state = makeInitialState([makeConfig()]);
    const nextState = configReducer(state, duplicateConfig('nonexistent' as any));
    expect(nextState.error).toBe('Invalid Configuration');
  });

  it('importConfigs should append configs', () => {
    const existing = makeConfig({ url: 'https://existing.com' });
    const imported = makeConfig({ url: 'https://imported.com' });
    const state = makeInitialState([existing]);
    const nextState = configReducer(state, importConfigs([imported]));
    expect(nextState.configs).toHaveLength(2);
  });

  it('setConfigs should replace all configs', () => {
    const old = makeConfig({ url: 'https://old.com' });
    const fresh = makeConfig({ url: 'https://new.com' });
    const state = makeInitialState([old]);
    const nextState = configReducer(state, setConfigs([fresh]));
    expect(nextState.configs).toHaveLength(1);
    expect(nextState.configs[0].url).toBe('https://new.com');
  });

  it('reorderConfigs should replace configs in new order', () => {
    const c1 = makeConfig({ url: 'https://first.com' });
    const c2 = makeConfig({ url: 'https://second.com' });
    const state = makeInitialState([c1, c2]);
    const nextState = configReducer(state, reorderConfigs([c2, c1]));
    expect(nextState.configs[0].url).toBe('https://second.com');
    expect(nextState.configs[1].url).toBe('https://first.com');
  });

  it('setSearch should update search string', () => {
    const state = makeInitialState();
    const nextState = configReducer(state, setSearch('hello'));
    expect(nextState.search).toBe('hello');
  });

  it('setConfigMessage should set message and clear error', () => {
    const state = { ...makeInitialState(), error: 'old error' };
    const nextState = configReducer(state, setConfigMessage('saved'));
    expect(nextState.message).toBe('saved');
    expect(nextState.error).toBeUndefined();
  });

  it('setConfigError should set error and clear message', () => {
    const state = { ...makeInitialState(), message: 'old message' };
    const nextState = configReducer(state, setConfigError('something went wrong'));
    expect(nextState.error).toBe('something went wrong');
    expect(nextState.message).toBeUndefined();
  });

  it('setDetailVisibility should toggle detail visibility', () => {
    const state = makeInitialState();
    expect(state.detailVisibility.name).toBe(true);
    const nextState = configReducer(state, setDetailVisibility('name'));
    expect(nextState.detailVisibility.name).toBe(false);
    const toggledBack = configReducer(nextState, setDetailVisibility('name'));
    expect(toggledBack.detailVisibility.name).toBe(true);
  });
});

describe('config slice – action management', () => {
  it('addAction should push a new action to config', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const nextState = configReducer(state, addAction({ configId: config.id }));
    expect(nextState.configs[0].actions.length).toBeGreaterThan(config.actions.length);
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('addAction should set error when configId not found', () => {
    const state = makeInitialState([makeConfig()]);
    const nextState = configReducer(state, addAction({ configId: 'bad-id' as any }));
    expect(nextState.error).toBe('Invalid Configuration');
  });

  it('updateAction should update action field', () => {
    const config = makeConfig();
    const actionId = config.actions[0].id;
    const state = makeInitialState([config]);
    const nextState = configReducer(state, updateAction({ configId: config.id, actionId, name: 'value', value: 'hello' }));
    expect((nextState.configs[0].actions[0] as any).value).toBe('hello');
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('updateAction should set error when configId not found', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const nextState = configReducer(state, updateAction({ configId: 'bad' as any, actionId: config.actions[0].id, name: 'value', value: 'x' }));
    expect(nextState.error).toBe('Invalid Configuration');
  });

  it('updateAction should set error when actionId not found', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const nextState = configReducer(state, updateAction({ configId: config.id, actionId: 'bad-action' as any, name: 'value', value: 'x' }));
    expect(nextState.error).toBe('Invalid Action');
  });

  it('removeAction should remove an action from config', () => {
    const config = makeConfig();
    const actionId = config.actions[0].id;
    const state = makeInitialState([config]);
    const nextState = configReducer(state, removeAction({ configId: config.id, actionId }));
    expect(nextState.configs[0].actions).toHaveLength(config.actions.length - 1);
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('removeAction should set error when configId not found', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const nextState = configReducer(state, removeAction({ configId: 'bad' as any, actionId: config.actions[0].id }));
    expect(nextState.error).toBe('Invalid Configuration');
  });

  it('removeAction should set error when actionId not found', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const nextState = configReducer(state, removeAction({ configId: config.id, actionId: 'bad-action' as any }));
    expect(nextState.error).toBe('Invalid Action');
  });

  it('reorderActions should reorder actions within a config', () => {
    const action1 = getDefaultAction('#btn1');
    const action2 = getDefaultAction('#btn2');
    const config = makeConfig({ actions: [action1, action2] });
    const state = makeInitialState([config]);
    const nextState = configReducer(state, reorderActions({ configId: config.id, oldIndex: 0, newIndex: 1 }));
    expect(nextState.configs[0].actions[0].id).toBe(action2.id);
    expect(nextState.configs[0].actions[1].id).toBe(action1.id);
  });
});

describe('config slice – syncBatch', () => {
  it('should set batch on config', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const batch: IBatch = { size: 5, delay: 1000 };
    const nextState = configReducer(state, syncBatch({ configId: config.id, batch }));
    expect(nextState.configs[0].batch).toEqual(batch);
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('should set error for invalid configId', () => {
    const state = makeInitialState([makeConfig()]);
    const nextState = configReducer(state, syncBatch({ configId: 'bad' as any, batch: { size: 1, delay: 0 } }));
    expect(nextState.error).toBe('Invalid Configuration');
  });
});

describe('config slice – syncSchedule', () => {
  it('should set schedule on config', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const schedule: ISchedule = { date: '2025-01-01', time: '10:00', repeat: 1 };
    const nextState = configReducer(state, syncSchedule({ configId: config.id, schedule }));
    expect(nextState.configs[0].schedule).toEqual(schedule);
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('should remove schedule when not provided', () => {
    const schedule: ISchedule = { date: '2025-01-01', time: '10:00', repeat: 1 };
    const config = makeConfig({ schedule });
    const state = makeInitialState([config]);
    const nextState = configReducer(state, syncSchedule({ configId: config.id }));
    expect(nextState.configs[0].schedule).toBeUndefined();
  });
});

describe('config slice – syncWatch', () => {
  it('should set watch on config', () => {
    const config = makeConfig();
    const state = makeInitialState([config]);
    const watch: IWatchSettings = { element: '#status', value: 'done', wait: 500 };
    const nextState = configReducer(state, syncWatch({ configId: config.id, watch }));
    expect(nextState.configs[0].watch).toEqual(watch);
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('should remove watch when not provided', () => {
    const watch: IWatchSettings = { element: '#status', value: 'done', wait: 500 };
    const config = makeConfig({ watch });
    const state = makeInitialState([config]);
    const nextState = configReducer(state, syncWatch({ configId: config.id }));
    expect(nextState.configs[0].watch).toBeUndefined();
  });
});

describe('config slice – syncActionAddon', () => {
  it('should set addon on action', () => {
    const config = makeConfig();
    const actionId = config.actions[0].id;
    const state = makeInitialState([config]);
    const addon = { recheck: 5, recheckInterval: 2, recheckGoto: undefined };
    const nextState = configReducer(state, syncActionAddon({ configId: config.id, actionId, addon }));
    expect((nextState.configs[0].actions[0] as any).addon).toEqual(addon);
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('should remove addon when not provided', () => {
    const config = makeConfig();
    const actionId = config.actions[0].id;
    const state = makeInitialState([config]);
    const addon = { recheck: 5, recheckInterval: 2, recheckGoto: undefined };
    let nextState = configReducer(state, syncActionAddon({ configId: config.id, actionId, addon }));
    nextState = configReducer(nextState, syncActionAddon({ configId: config.id, actionId }));
    expect((nextState.configs[0].actions[0] as any).addon).toBeUndefined();
  });
});

describe('config slice – syncActionSettings', () => {
  it('should set settings on action', () => {
    const config = makeConfig();
    const actionId = config.actions[0].id;
    const state = makeInitialState([config]);
    const settings = { retry: 3, retryInterval: 1000 };
    const nextState = configReducer(state, syncActionSettings({ configId: config.id, actionId, settings }));
    expect((nextState.configs[0].actions[0] as any).settings).toEqual(settings);
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('should remove settings when not provided', () => {
    const config = makeConfig();
    const actionId = config.actions[0].id;
    const state = makeInitialState([config]);
    const settings = { retry: 3, retryInterval: 1000 };
    let nextState = configReducer(state, syncActionSettings({ configId: config.id, actionId, settings }));
    nextState = configReducer(nextState, syncActionSettings({ configId: config.id, actionId }));
    expect((nextState.configs[0].actions[0] as any).settings).toBeUndefined();
  });
});

describe('config slice – syncActionStatement', () => {
  it('should set statement on action', () => {
    const config = makeConfig();
    const actionId = config.actions[0].id;
    const state = makeInitialState([config]);
    const statement = { conditions: [], option: undefined, goto: undefined };
    const nextState = configReducer(state, syncActionStatement({ configId: config.id, actionId, statement }));
    expect((nextState.configs[0].actions[0] as any).statement).toEqual(statement);
    expect(nextState.configs[0].updated).toBe(true);
  });

  it('should remove statement when not provided', () => {
    const config = makeConfig();
    const actionId = config.actions[0].id;
    const state = makeInitialState([config]);
    const statement = { conditions: [] };
    let nextState = configReducer(state, syncActionStatement({ configId: config.id, actionId, statement }));
    nextState = configReducer(nextState, syncActionStatement({ configId: config.id, actionId }));
    expect((nextState.configs[0].actions[0] as any).statement).toBeUndefined();
  });
});
