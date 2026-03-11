import { defaultSettings, defaultSettingsNotifications } from '@dhruv-techapps/acf-common';
import { EAutoBackup } from '@dhruv-techapps/shared-google-drive/service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { discordDeleteAPI, discordGetAPI, discordLoginAPI, settingsGetAPI } from './settings.api';
import { ISettingsStore, setSettingsError, setSettingsMessage, settingsReducer, switchSettingsModal, updateSettings, updateSettingsBackup, updateSettingsNotification } from './settings.slice';
Object.defineProperty(globalThis, 'dataLayer', { value: [], writable: true });

// We need to mock the getI18n and StorageService but for pure reducer tests
// we don't need these mocks since we're only testing the reducer directly
const initialState: ISettingsStore = { visible: false, loading: true, settings: { ...defaultSettings } };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('settings slice – modal', () => {
  it('should return initial state', () => {
    const state = settingsReducer(undefined, { type: '@@INIT' });
    expect(state.visible).toBe(false);
    expect(state.loading).toBe(true);
    expect(state.settings).toEqual(defaultSettings);
  });

  it('switchSettingsModal should toggle visible', () => {
    let state = settingsReducer(initialState, switchSettingsModal());
    expect(state.visible).toBe(true);
    state = settingsReducer(state, switchSettingsModal());
    expect(state.visible).toBe(false);
  });
});

describe('settings slice – updateSettings', () => {
  it('should update a top-level setting field', () => {
    const state = settingsReducer(initialState, updateSettings({ retry: 10 }));

    expect(state.settings.retry).toBe(10);
  });

  it('should update checkiFrames setting', () => {
    const state = settingsReducer(initialState, updateSettings({ checkiFrames: true }));

    expect(state.settings.checkiFrames).toBe(true);
  });

  it('should update reloadOnError setting', () => {
    const state = settingsReducer(initialState, updateSettings({ reloadOnError: true }));

    expect(state.settings.reloadOnError).toBe(true);
  });

  it('should update retryInterval setting', () => {
    const state = settingsReducer(initialState, updateSettings({ retryInterval: 2 }));

    expect(state.settings.retryInterval).toBe(2);
  });

  it('should update retryIntervalTo setting', () => {
    const state = settingsReducer(initialState, updateSettings({ retryIntervalTo: 5 }));

    expect(state.settings.retryIntervalTo).toBe(5);
  });

  it('should update statusBar setting', () => {
    const state = settingsReducer(initialState, updateSettings({ statusBar: 'top-left' }));

    expect(state.settings.statusBar).toBe('top-left');
  });

  it('should update multiple fields at once', () => {
    const state = settingsReducer(initialState, updateSettings({ checkiFrames: true, reloadOnError: true }));

    expect(state.settings.checkiFrames).toBe(true);
    expect(state.settings.reloadOnError).toBe(true);
  });
});

describe('settings slice – updateSettingsNotification', () => {
  it('should create notifications object when it does not exist', () => {
    const state = settingsReducer(initialState, updateSettingsNotification({ name: 'onError', value: true }));
    expect(state.settings.notifications).toBeDefined();
    expect(state.settings.notifications!.onError).toBe(true);
  });

  it('should update existing notification field', () => {
    const withNotifications = {
      ...initialState,
      settings: {
        ...initialState.settings,
        notifications: { ...defaultSettingsNotifications }
      }
    };
    const state = settingsReducer(withNotifications, updateSettingsNotification({ name: 'onAction', value: true }));
    expect(state.settings.notifications!.onAction).toBe(true);
  });

  it('should update sound notification', () => {
    const state = settingsReducer(initialState, updateSettingsNotification({ name: 'sound', value: true }));
    expect(state.settings.notifications!.sound).toBe(true);
  });

  it('should update onBatch notification', () => {
    const state = settingsReducer(initialState, updateSettingsNotification({ name: 'onBatch', value: true }));
    expect(state.settings.notifications!.onBatch).toBe(true);
  });

  it('should update onConfig notification', () => {
    const state = settingsReducer(initialState, updateSettingsNotification({ name: 'onConfig', value: true }));
    expect(state.settings.notifications!.onConfig).toBe(true);
  });

  it('should update discord notification', () => {
    const state = settingsReducer(initialState, updateSettingsNotification({ name: 'discord', value: true }));
    expect(state.settings.notifications!.discord).toBe(true);
  });
});

describe('settings slice – updateSettingsBackup', () => {
  it('should create backup object when it does not exist', () => {
    const state = settingsReducer(initialState, updateSettingsBackup(EAutoBackup.DAILY));
    expect(state.settings.backup).toBeDefined();
    expect(state.settings.backup!.autoBackup).toBe(EAutoBackup.DAILY);
  });

  it('should update existing backup autoBackup', () => {
    const withBackup = {
      ...initialState,
      settings: {
        ...initialState.settings,
        backup: { autoBackup: EAutoBackup.OFF as any }
      }
    };
    const state = settingsReducer(withBackup, updateSettingsBackup(EAutoBackup.WEEKLY));
    expect(state.settings.backup!.autoBackup).toBe(EAutoBackup.WEEKLY);
  });

  it('should update backup to MONTHLY', () => {
    const state = settingsReducer(initialState, updateSettingsBackup(EAutoBackup.MONTHLY));
    expect(state.settings.backup!.autoBackup).toBe(EAutoBackup.MONTHLY);
  });

  it('should update backup to OFF', () => {
    const withBackup = {
      ...initialState,
      settings: {
        ...initialState.settings,
        backup: { autoBackup: EAutoBackup.DAILY as any }
      }
    };
    const state = settingsReducer(withBackup, updateSettingsBackup(EAutoBackup.OFF));
    expect(state.settings.backup!.autoBackup).toBe(EAutoBackup.OFF);
  });
});

describe('settings slice – messages', () => {
  it('setSettingsMessage should set message and clear error', () => {
    const withError = { ...initialState, error: 'some error' };
    const state = settingsReducer(withError, setSettingsMessage('saved'));
    expect(state.message).toBe('saved');
    expect(state.error).toBeUndefined();
  });

  it('setSettingsMessage should clear message when undefined is passed', () => {
    const withMessage = { ...initialState, message: 'saved' };
    const state = settingsReducer(withMessage, setSettingsMessage(undefined));
    expect(state.message).toBeUndefined();
  });

  it('setSettingsError should set error and stop loading', () => {
    const state = settingsReducer(initialState, setSettingsError('failed to save'));
    expect(state.error).toBe('failed to save');
    expect(state.loading).toBe(false);
  });

  it('setSettingsError should clear message', () => {
    const withMessage = { ...initialState, message: 'saved' };
    const state = settingsReducer(withMessage, setSettingsError('failed'));
    expect(state.error).toBe('failed');
    expect(state.message).toBeUndefined();
  });
});

describe('settings slice – async API', () => {
  it('settingsGetAPI.fulfilled should update settings and set loading false', () => {
    const newSettings = { ...defaultSettings, retry: 10 };
    const action = settingsGetAPI.fulfilled(newSettings, 'requestId', undefined);
    const state = settingsReducer(initialState, action);
    expect(state.settings.retry).toBe(10);
    expect(state.loading).toBe(false);
  });

  it('settingsGetAPI.fulfilled with empty payload should not overwrite settings', () => {
    const action = settingsGetAPI.fulfilled({} as any, 'requestId', undefined);
    const state = settingsReducer(initialState, action);
    expect(state.settings).toEqual(defaultSettings);
    expect(state.loading).toBe(false);
  });

  it('settingsGetAPI.rejected should set error and stop loading', () => {
    const action = settingsGetAPI.rejected(new Error('network error'), 'requestId', undefined);
    const state = settingsReducer(initialState, action);
    expect(state.error).toBe('network error');
    expect(state.loading).toBe(false);
  });

  it('discordGetAPI.pending should set discordLoading and clear error', () => {
    const action = discordGetAPI.pending('requestId', undefined);
    const state = settingsReducer({ ...initialState, error: 'old' }, action);
    expect(state.discordLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('discordGetAPI.fulfilled should set discord data', () => {
    const discord = { id: '123', username: 'TestUser' } as any;
    const action = discordGetAPI.fulfilled(discord, 'requestId', undefined);
    const state = settingsReducer(initialState, action);
    expect(state.discord).toEqual(discord);
    expect(state.discordLoading).toBe(false);
  });

  it('discordGetAPI.rejected should set error and stop discordLoading', () => {
    const action = discordGetAPI.rejected(new Error('discord error'), 'requestId', undefined);
    const state = settingsReducer({ ...initialState, discordLoading: true }, action);
    expect(state.error).toBe('discord error');
    expect(state.discordLoading).toBe(false);
  });

  it('discordLoginAPI.fulfilled should set discord data', () => {
    const discord = { id: '456', username: 'LoginUser' } as any;
    const action = discordLoginAPI.fulfilled(discord, 'requestId', undefined);
    const state = settingsReducer(initialState, action);
    expect(state.discord).toEqual(discord);
  });

  it('discordLoginAPI.rejected should set error', () => {
    const action = discordLoginAPI.rejected(new Error('login failed'), 'requestId', undefined);
    const state = settingsReducer(initialState, action);
    expect(state.error).toBe('login failed');
  });

  it('discordDeleteAPI.fulfilled should remove discord data', () => {
    const withDiscord = { ...initialState, discord: { id: '123' } as any };
    const action = discordDeleteAPI.fulfilled(undefined as any, 'requestId', undefined);
    const state = settingsReducer(withDiscord, action);
    expect(state.discord).toBeUndefined();
  });

  it('discordDeleteAPI.rejected should set error', () => {
    const action = discordDeleteAPI.rejected(new Error('delete failed'), 'requestId', undefined);
    const state = settingsReducer(initialState, action);
    expect(state.error).toBe('delete failed');
  });
});
