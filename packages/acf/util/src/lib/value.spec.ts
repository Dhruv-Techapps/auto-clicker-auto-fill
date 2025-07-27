import { Value } from './value';

describe('getValue', () => {
  it('should return the original value if it does not match any patterns', async () => {
    const result = await Value.getValue('simpleValue');
    expect(result).toBe('simpleValue');
  });

  it('should handle RANDOM pattern correctly', async () => {
    const result = await Value.getValue('<random[a-zA-Z]{5}>');
    expect(result).toMatch(/[a-zA-Z]{5}/);
  });

  it('should handle RANDOM pattern correctly', async () => {
    const query = '<random[김이박최강오임]{1}>';
    const result = await Value.getValue(query);
    expect(result).toBeDefined();
  });

  it('should replace <batchRepeat> with the correct value', async () => {
    window.ext = window.ext ?? {};
    window.ext.__batchRepeat = 5;
    const result = await Value.getValue('<batchRepeat>');
    expect(result).toBe('5');
  });

  it('should replace <actionRepeat> with the correct value', async () => {
    window.ext = window.ext ?? {};
    window.ext.__actionRepeat = 3;
    const result = await Value.getValue('<actionRepeat>');
    expect(result).toBe('3');
  });

  it('should replace <sessionCount> with the correct value', async () => {
    window.ext = window.ext ?? {};
    window.ext.__sessionCount = 10;
    const result = await Value.getValue('<sessionCount>');
    expect(result).toBe('10');
  });

  it('should handle multiple QUERY patterns correctly', async () => {
    const searchParams = new URLSearchParams();
    searchParams.set('param1', 'value1');
    searchParams.set('param2', 'value2');
    const originalSearch = window.location.search;
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);

    const result = await Value.getValue('<query::param1> and <query::param2>');
    expect(result).toBe('value1 and value2');

    window.history.replaceState({}, '', `${window.location.pathname}${originalSearch}`);
  });

  it('should handle multiple QUERY patterns correctly with sanitization and validation', async () => {
    const searchParams = new URLSearchParams();
    searchParams.set('param1', 'value1');
    searchParams.set('param2', 'value2<script>alert(1)</script>');
    const originalSearch = window.location.search;
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);

    const result = await Value.getValue('<query::param1> and <query::param2>');
    expect(result).toBe('value1 and value2&lt;script&gt;alert(1)&lt;/script&gt;');

    window.history.replaceState({}, '', `${window.location.pathname}${originalSearch}`);
  });
});
describe('validateQueryParam', () => {
  const { validateQueryParam } = Value;

  it('should return true for valid key and value', () => {
    expect(validateQueryParam('param1', 'value1')).toBe(true);
    expect(validateQueryParam('key_2', 'value-2')).toBe(true);
    expect(validateQueryParam('key%20', 'value_3')).toBe(true);
    expect(validateQueryParam('key-4', 'value 4')).toBe(true);
    expect(validateQueryParam('A', 'B')).toBe(true);
    expect(validateQueryParam('abcDEF123', '456XYZ')).toBe(true);
  });

  it('should return false for invalid key', () => {
    expect(validateQueryParam('param!', 'value1')).toBe(false);
    expect(validateQueryParam('key$', 'value2')).toBe(false);
    expect(validateQueryParam('key@', 'value3')).toBe(false);
    expect(validateQueryParam('key<', 'value4')).toBe(false);
    expect(validateQueryParam('key>', 'value5')).toBe(false);
  });

  it('should return false for invalid value', () => {
    expect(validateQueryParam('param1', 'value!')).toBe(false);
    expect(validateQueryParam('param2', 'value@')).toBe(false);
    expect(validateQueryParam('param3', 'value<')).toBe(false);
    expect(validateQueryParam('param4', 'value>')).toBe(false);
    expect(validateQueryParam('param5', 'value/')).toBe(false);
  });

  it('should return false if either key or value contains script tags', () => {
    expect(validateQueryParam('<script>', 'value')).toBe(false);
    expect(validateQueryParam('key', '<script>')).toBe(false);
    expect(validateQueryParam('key', 'value<script>alert(1)</script>')).toBe(false);
    expect(validateQueryParam('key<script>', 'value')).toBe(false);
  });

  it('should return false for empty key or value', () => {
    expect(validateQueryParam('', 'value')).toBe(false);
    expect(validateQueryParam('key', '')).toBe(false);
    expect(validateQueryParam('', '')).toBe(false);
  });
});
