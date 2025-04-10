import { dateParser } from '../..';

describe('dateParser', () => {
  test('works', () => {
    const d = new Date();
    expect(dateParser(undefined, d.toJSON())).not.toBeNull();
    expect(dateParser(undefined, d.toJSON())).toEqual(d);
    expect(dateParser(undefined, 'test')).toEqual('test');
    expect(dateParser(undefined, 123)).toEqual(123);
  });
});
