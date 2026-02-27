import { describe, expect, it, vi } from 'vitest';

Object.defineProperty(window, 'dataLayer', { value: [], writable: true });

import { actionAddonReducer, IActionAddonStore, setActionAddonError, setActionAddonMessage, switchActionAddonModal, updateActionAddon, updateActionAddonGoto } from './addon.slice';
import { defaultAddon } from '@dhruv-techapps/acf-common';

const initialState: IActionAddonStore = { visible: false, addon: { ...defaultAddon } };

describe('actionAddon slice', () => {
  it('should return initial state', () => {
    const state = actionAddonReducer(undefined, { type: '@@INIT' });
    expect(state.visible).toBe(false);
    expect(state.addon).toBeDefined();
  });

  it('switchActionAddonModal should toggle visible', () => {
    let state = actionAddonReducer(initialState, switchActionAddonModal());
    expect(state.visible).toBe(true);
    state = actionAddonReducer(state, switchActionAddonModal());
    expect(state.visible).toBe(false);
  });

  it('updateActionAddon should update addon field', () => {
    const state = actionAddonReducer(initialState, updateActionAddon({ name: 'recheck', value: 10 }));
    expect((state.addon as any).recheck).toBe(10);
  });

  it('updateActionAddonGoto should set recheckGoto', () => {
    const state = actionAddonReducer(initialState, updateActionAddonGoto(2));
    expect(state.addon.recheckGoto).toBe(2);
  });

  it('setActionAddonMessage should set message and clear error', () => {
    const withError = { ...initialState, error: 'bad' };
    const state = actionAddonReducer(withError, setActionAddonMessage('ok'));
    expect(state.message).toBe('ok');
    expect(state.error).toBeUndefined();
  });

  it('setActionAddonError should set error and clear message', () => {
    const withMessage = { ...initialState, message: 'ok' };
    const state = actionAddonReducer(withMessage, setActionAddonError('fail'));
    expect(state.error).toBe('fail');
    expect(state.message).toBeUndefined();
  });
});
