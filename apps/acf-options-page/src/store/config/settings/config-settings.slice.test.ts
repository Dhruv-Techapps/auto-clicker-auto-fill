import { describe, expect, it } from 'vitest';

Object.defineProperty(window, 'dataLayer', { value: [], writable: true });

import { configSettingsReducer, IConfigSettingsStore, setConfigSettingsError, setConfigSettingsMessage, switchConfigSettingsModal } from './config-settings.slice';

const initialState: IConfigSettingsStore = { visible: false };

describe('configSettings slice', () => {
  it('should return initial state', () => {
    const state = configSettingsReducer(undefined, { type: '@@INIT' });
    expect(state.visible).toBe(false);
    expect(state.error).toBeUndefined();
    expect(state.message).toBeUndefined();
  });

  it('switchConfigSettingsModal should toggle visible', () => {
    let state = configSettingsReducer(initialState, switchConfigSettingsModal());
    expect(state.visible).toBe(true);
    state = configSettingsReducer(state, switchConfigSettingsModal());
    expect(state.visible).toBe(false);
  });

  it('setConfigSettingsMessage should set message and clear error', () => {
    const withError = { ...initialState, error: 'bad' };
    const state = configSettingsReducer(withError, setConfigSettingsMessage('saved'));
    expect(state.message).toBe('saved');
    expect(state.error).toBeUndefined();
  });

  it('setConfigSettingsError should set error and clear message', () => {
    const withMessage = { ...initialState, message: 'ok' };
    const state = configSettingsReducer(withMessage, setConfigSettingsError('failed'));
    expect(state.error).toBe('failed');
    expect(state.message).toBeUndefined();
  });
});
