import { ElementUtil } from './element-util';

const stringValue = 'Dharmesh';
const numberValue = '2';

describe('ElementUtil', () => {
  describe('getNameValue', () => {
    const element = document.createElement('input');
    element.id = 'test';
    element.name = 'test';
    test('checkbox - true', () => {
      element.type = 'checkbox';
      element.checked = true;
      expect(ElementUtil.getNameValue(element)).toBeDefined();
      expect(ElementUtil.getNameValue(element)).toEqual({ name: 'test', value: true });
    });
    test('checkbox - no - confuse', () => {
      element.type = 'checkbox';
      element.checked = false;
      expect(ElementUtil.getNameValue(element)).toBeDefined();
      expect(ElementUtil.getNameValue(element)).toEqual({ name: 'test', value: false });
    });
  });
  describe('getValue', () => {
    describe('checkbox', () => {
      const element = document.createElement('input');
      element.id = 'test';
      element.name = 'test';
      test('checkbox - true', () => {
        element.type = 'checkbox';
        element.checked = true;
        expect(ElementUtil.getValue(element)).toBeDefined();
        expect(ElementUtil.getValue(element)).toBeTruthy();
      });
      test('checkbox - false', () => {
        element.type = 'checkbox';
        element.checked = false;
        expect(ElementUtil.getValue(element)).toBeDefined();
        expect(ElementUtil.getValue(element)).toBeFalsy();
      });
      test('checkbox - no - result', () => {
        element.type = 'checkbox';
        element.checked = true;
        expect(ElementUtil.getValue(element)).toBeDefined();
        expect(ElementUtil.getValue(element)).toBeTruthy();
      });
    });
    describe('Error: String for Number', () => {
      const element = document.createElement('input');
      element.id = 'test';
      element.name = 'test';
      element.type = 'text';
      element.checked = true;
      element.value = stringValue;
      element.setAttribute('data-type', 'number');
      test('test for error', () => {
        expect(() => {
          ElementUtil.getValue(element);
        }).toThrow(TypeError);
        expect(() => {
          ElementUtil.getValue(element);
        }).toThrow(`Not a valid number : ${stringValue}`);
      });
    });
    describe('Number', () => {
      const element = document.createElement('input');
      element.id = 'test';
      element.name = 'test';
      element.type = 'text';
      element.value = numberValue;
      element.setAttribute('data-type', 'number');
      test('test', () => {
        expect(ElementUtil.getValue(element)).toEqual(Number(numberValue));
      });
    });
    describe('String', () => {
      const element = document.createElement('input');
      element.id = 'test';
      element.name = 'test';
      element.type = 'text';
      element.value = stringValue;
      test('test', () => {
        expect(ElementUtil.getValue(element)).toEqual(stringValue);
      });
    });
  });
});
