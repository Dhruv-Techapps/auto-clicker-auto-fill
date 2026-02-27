import { describe, expect, it } from 'vitest';
import { getManifest } from './app.api';
import { appReducer, setAppError, setManifest, switchExtensionNotFound } from './app.slice';
// Mock window.dataLayer before any imports that reference it
Object.defineProperty(window, 'dataLayer', { value: [], writable: true });

describe('app slice', () => {
  const initialState = { loading: true, extensionNotFound: false };

  it('should return initial state', () => {
    expect(appReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setManifest should set manifest and stop loading', () => {
    const manifest = { name: 'Test Extension', version: '1.0.0' };
    const state = appReducer(initialState, setManifest(manifest));
    expect(state.manifest).toEqual(manifest);
    expect(state.loading).toBe(false);
  });

  it('setAppError should set error and stop loading', () => {
    const state = appReducer(initialState, setAppError('Something went wrong'));
    expect(state.error).toBe('Something went wrong');
    expect(state.loading).toBe(false);
  });

  it('switchExtensionNotFound should toggle extensionNotFound', () => {
    const state = appReducer(initialState, switchExtensionNotFound(undefined));
    expect(state.extensionNotFound).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('switchExtensionNotFound should set error message when provided', () => {
    const state = appReducer(initialState, switchExtensionNotFound('Connection refused'));
    expect(state.error).toBe('Connection refused');
  });

  it('getManifest.fulfilled should set manifest and stop loading', () => {
    const manifest = { name: 'ACF Extension', version: '3.0.0' };
    const action = getManifest.fulfilled(manifest, 'requestId', undefined);
    const state = appReducer(initialState, action);
    expect(state.manifest).toEqual(manifest);
    expect(state.loading).toBe(false);
  });

  it('getManifest.rejected should set loading false and error', () => {
    const action = getManifest.rejected(new Error('Extension not found'), 'requestId', undefined);
    const state = appReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeDefined();
  });

  it('getManifest.rejected with NO_EXTENSION_ERROR should set errorButton and friendly message', () => {
    const noExtensionMsg = 'Could not establish connection. Receiving end does not exist.';
    const action = getManifest.rejected(new Error(noExtensionMsg), 'requestId', undefined);
    const state = appReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.errorButton).toBe(true);
    expect(state.error).toContain('extension');
  });
});
