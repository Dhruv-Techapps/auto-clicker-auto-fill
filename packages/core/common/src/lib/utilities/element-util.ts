export class ElementUtil {
  static getValue(e: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
    const { value, type } = e;
    if (e instanceof HTMLInputElement && type === 'checkbox') {
      return e.checked;
    }
    if (e.getAttribute('data-type') === 'number') {
      const result = Number(value);
      if (Number.isNaN(result)) {
        throw new TypeError(`Not a valid number : ${value}`);
      } else {
        return result;
      }
    } else {
      return value;
    }
  }

  static getNameValue(e: HTMLInputElement) {
    return { name: e.name, value: ElementUtil.getValue(e) };
  }
}
