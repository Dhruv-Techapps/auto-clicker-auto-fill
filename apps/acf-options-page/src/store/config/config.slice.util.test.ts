import { IConfiguration } from '@dhruv-techapps/acf-common';
import { describe, expect, it } from 'vitest';
import { getConfigName, updateConfigId, updateConfigIds } from './config.slice.util';

describe('getConfigName', () => {
  it('returns undefined when url is undefined', () => {
    expect(getConfigName(undefined)).toBeUndefined();
  });

  it('returns url as-is when it does not contain ://', () => {
    expect(getConfigName('no-protocol')).toBe('no-protocol');
  });

  it('extracts domain from a full URL', () => {
    expect(getConfigName('https://www.example.com/path')).toBe('example.com');
  });

  it('extracts domain from a URL without www', () => {
    expect(getConfigName('https://example.com/some/path')).toBe('example.com');
  });

  it('returns full domain when it only has two parts', () => {
    expect(getConfigName('https://example.com')).toBe('example.com');
  });

  it('extracts last two parts for a multi-level domain', () => {
    expect(getConfigName('https://sub.example.co.uk/page')).toBe('co.uk');
  });
});

describe('updateConfigId', () => {
  it('assigns a new UUID to config when id is missing', () => {
    const config = {
      id: undefined as any,
      url: 'https://example.com',
      enable: true,
      actions: []
    } as unknown as IConfiguration;

    const result = updateConfigId(config);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
  });

  it('keeps existing id when config already has one', () => {
    const existingId = crypto.randomUUID();
    const config = {
      id: existingId,
      url: 'https://example.com',
      enable: true,
      actions: []
    } as unknown as IConfiguration;

    const result = updateConfigId(config);
    expect(result.id).toBe(existingId);
  });

  it('assigns UUIDs to actions that are missing ids', () => {
    const existingId = crypto.randomUUID();
    const config = {
      id: existingId,
      url: 'https://example.com',
      enable: true,
      actions: [{ elementFinder: '#btn', id: undefined as any }]
    } as unknown as IConfiguration;

    const result = updateConfigId(config);
    expect(result.actions[0].id).toBeDefined();
  });

  it('keeps existing action ids', () => {
    const configId = crypto.randomUUID();
    const actionId = crypto.randomUUID();
    const config = {
      id: configId,
      url: 'https://example.com',
      enable: true,
      actions: [{ elementFinder: '#btn', id: actionId }]
    } as unknown as IConfiguration;

    const result = updateConfigId(config);
    expect(result.actions[0].id).toBe(actionId);
  });
});

describe('updateConfigIds', () => {
  it('processes all configs in the array', () => {
    const configs = [
      { id: undefined as any, url: 'https://a.com', enable: true, actions: [] },
      { id: undefined as any, url: 'https://b.com', enable: true, actions: [] }
    ] as unknown as IConfiguration[];

    const results = updateConfigIds(configs);
    expect(results).toHaveLength(2);
    results.forEach((r) => expect(r.id).toBeDefined());
  });
});
