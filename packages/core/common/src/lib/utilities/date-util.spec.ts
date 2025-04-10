import { DateUtil } from './date-util';

describe('DateUtil', () => {
  const date = new Date();
  describe('getDateWithoutTime', () => {
    test('getDate', () => {
      expect(DateUtil.getDateWithoutTime().getDate()).toEqual(date.getDate());
    });
    test('getDay', () => {
      expect(DateUtil.getDateWithoutTime().getDay()).toEqual(date.getDay());
    });
    test('getFullYear', () => {
      expect(DateUtil.getDateWithoutTime().getFullYear()).toEqual(date.getFullYear());
    });
    test('getHours', () => {
      expect(DateUtil.getDateWithoutTime().getHours()).toEqual(0);
    });
    test('getMinutes', () => {
      expect(DateUtil.getDateWithoutTime().getMinutes()).toEqual(0);
    });
    test('getSeconds', () => {
      expect(DateUtil.getDateWithoutTime().getSeconds()).toEqual(0);
    });
    test('getMilliseconds', () => {
      expect(DateUtil.getDateWithoutTime().getSeconds()).toEqual(0);
    });
    test('by passing date', () => {
      expect(DateUtil.getDateWithoutTime(new Date()).getDate()).toEqual(date.getDate());
    });
  });
});
