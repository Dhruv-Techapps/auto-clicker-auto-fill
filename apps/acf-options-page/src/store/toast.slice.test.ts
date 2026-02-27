import { describe, expect, it } from 'vitest';
import toastReducer, { addToast, hideToast } from './toast.slice';

describe('toast slice', () => {
  const initialState = [];

  it('should return empty array as initial state', () => {
    expect(toastReducer(undefined, { type: '@@INIT' })).toEqual([]);
  });

  it('addToast should append a toast to the array', () => {
    const toast = { header: 'Test Header', body: 'Test Body' };
    const state = toastReducer(initialState, addToast(toast));
    expect(state).toHaveLength(1);
    expect(state[0]).toMatchObject(toast);
  });

  it('addToast should append multiple toasts', () => {
    const toast1 = { header: 'First', body: 'Body 1' };
    const toast2 = { header: 'Second', body: 'Body 2', variant: 'success' as const };
    let state = toastReducer(initialState, addToast(toast1));
    state = toastReducer(state, addToast(toast2));
    expect(state).toHaveLength(2);
    expect(state[1].variant).toBe('success');
  });

  it('hideToast should set show to false for the given index', () => {
    const toast = { header: 'Header', show: true };
    let state = toastReducer(initialState, addToast(toast));
    state = toastReducer(state, hideToast(0));
    expect(state[0].show).toBe(false);
  });

  it('addToast supports variant types', () => {
    const toast = { header: 'Error', body: 'Something went wrong', variant: 'danger' as const };
    const state = toastReducer(initialState, addToast(toast));
    expect(state[0].variant).toBe('danger');
  });
});
