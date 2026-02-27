import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock LocalStorage
vi.mock('@acf-options-page/_helpers', () => ({
  LocalStorage: {
    getItem: vi.fn((_key: string, fallback: unknown) => fallback),
    setItem: vi.fn()
  }
}));

import { actionReducer, setActionError, setActionMessage, setColumnVisibility } from './action.slice';
import { IActionStore } from './action.slice';

const initialState: IActionStore = {
  columnVisibility: { name: true, initWait: true, repeat: true, repeatInterval: true }
};

describe('action slice', () => {
  it('should return initial state', () => {
    const state = actionReducer(undefined, { type: '@@INIT' });
    expect(state.columnVisibility).toBeDefined();
    expect(typeof state.columnVisibility.name).toBe('boolean');
  });

  it('setColumnVisibility should toggle the named column', () => {
    let state = actionReducer(initialState, setColumnVisibility('name'));
    expect(state.columnVisibility.name).toBe(false);

    state = actionReducer(state, setColumnVisibility('name'));
    expect(state.columnVisibility.name).toBe(true);
  });

  it('setColumnVisibility should toggle initWait column', () => {
    const state = actionReducer(initialState, setColumnVisibility('initWait'));
    expect(state.columnVisibility.initWait).toBe(false);
  });

  it('setActionMessage should set message and clear error', () => {
    const withError = { ...initialState, error: 'old error' };
    const state = actionReducer(withError, setActionMessage('all good'));
    expect(state.message).toBe('all good');
    expect(state.error).toBeUndefined();
  });

  it('setActionMessage with undefined clears message', () => {
    const withMessage = { ...initialState, message: 'something' };
    const state = actionReducer(withMessage, setActionMessage(undefined));
    expect(state.message).toBeUndefined();
  });

  it('setActionError should set error and clear message', () => {
    const withMessage = { ...initialState, message: 'old message' };
    const state = actionReducer(withMessage, setActionError('broken'));
    expect(state.error).toBe('broken');
    expect(state.message).toBeUndefined();
  });
});
