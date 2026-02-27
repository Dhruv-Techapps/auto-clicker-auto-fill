import { defaultActionSettings } from '@dhruv-techapps/acf-common';
import { describe, expect, it } from 'vitest';
import {
  actionSettingsReducer,
  IActionSettingsStore,
  setActionSettingsError,
  setActionSettingsMessage,
  switchActionSettingsModal,
  updateActionSettings,
  updateActionSettingsGoto
} from './action-settings.slice';

Object.defineProperty(window, 'dataLayer', { value: [], writable: true });
const initialState: IActionSettingsStore = { visible: false, settings: { ...defaultActionSettings } };

describe('actionSettings slice', () => {
  it('should return initial state', () => {
    const state = actionSettingsReducer(undefined, { type: '@@INIT' });
    expect(state.visible).toBe(false);
    expect(state.settings).toBeDefined();
  });

  it('switchActionSettingsModal should toggle visible', () => {
    let state = actionSettingsReducer(initialState, switchActionSettingsModal());
    expect(state.visible).toBe(true);
    state = actionSettingsReducer(state, switchActionSettingsModal());
    expect(state.visible).toBe(false);
  });

  it('updateActionSettings should update settings field', () => {
    const state = actionSettingsReducer(initialState, updateActionSettings({ name: 'retry', value: 5 }));
    expect((state.settings as any).retry).toBe(5);
  });

  it('updateActionSettings should update iframeFirst', () => {
    const state = actionSettingsReducer(initialState, updateActionSettings({ name: 'iframeFirst', value: true }));
    expect(state.settings.iframeFirst).toBe(true);
  });

  it('updateActionSettingsGoto should set retryGoto', () => {
    const state = actionSettingsReducer(initialState, updateActionSettingsGoto(3));
    expect(state.settings.retryGoto).toBe(3);
  });

  it('setActionSettingsMessage should set message and clear error', () => {
    const withError = { ...initialState, error: 'bad' };
    const state = actionSettingsReducer(withError, setActionSettingsMessage('saved'));
    expect(state.message).toBe('saved');
    expect(state.error).toBeUndefined();
  });

  it('setActionSettingsError should set error and clear message', () => {
    const withMessage = { ...initialState, message: 'ok' };
    const state = actionSettingsReducer(withMessage, setActionSettingsError('failed'));
    expect(state.error).toBe('failed');
    expect(state.message).toBeUndefined();
  });
});
