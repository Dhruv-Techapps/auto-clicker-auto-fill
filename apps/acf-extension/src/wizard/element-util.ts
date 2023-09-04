import { BUTTON_FILE_SUBMIT_NODE_NAME, RADIO_CHECKBOX_NODE_NAME } from '../common/constant';
import { xPath } from './dom-path';
import { WizardAction } from './type';

type selectType = {
  elementValue?: string;
  optionValue?: string;
};
export const WizardElementUtil = (() => {
  const radioCheckbox = (element: HTMLInputElement): boolean => element.checked;

  const select = (element: HTMLSelectElement): selectType | null => {
    const option = element.querySelector('option:checked') as HTMLOptionElement;
    if (option.index === 0) {
      return null;
    }
    return { elementValue: option.innerText, optionValue: `/option[${option.index + 1}]` };
  };

  const inputListener = async (element: HTMLInputElement | HTMLTextAreaElement | HTMLElement): Promise<string | null> =>
    new Promise((resolve) => {
      element.addEventListener('blur', (e) => {
        const input = e.target;
        if (input) {
          resolve((e.target as HTMLInputElement).value), { once: true, passive: true };
        } else {
          resolve(input);
        }
      });
    });

  const optionListener = async (element: HTMLSelectElement | HTMLOptionElement) =>
    new Promise<selectType | null>((resolve) => {
      element.addEventListener('blur', (e) => resolve(select(e.target as HTMLSelectElement)), { once: true, passive: true });
    });

  const clearXpath = (xpath: string): string => {
    if (xpath.includes('/option')) {
      xpath = xpath.replace(/\/option.*/, '');
    }
    return xpath;
  };

  const getName = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement) => element.name || element.type || element.getAttribute('for') || '';

  const check = async (element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLElement, listener = false): Promise<WizardAction | undefined> => {
    const elementFinder = xPath(element, true);

    if (element instanceof HTMLInputElement) {
      // Input Element
      if (RADIO_CHECKBOX_NODE_NAME.test(element.type)) {
        const checked = radioCheckbox(element);
        return { name: getName(element), elementFinder, checked, elementValue: element.value, elementType: element.type };
      }

      let value;
      let elementValue;
      if (element instanceof HTMLButtonElement || (element instanceof HTMLInputElement && BUTTON_FILE_SUBMIT_NODE_NAME.test(element.type))) {
        if (listener) {
          value = '';
        }
        elementValue = element.innerText;
      } else {
        value = listener ? await inputListener(element) : element.value || null;
      }

      if (value !== null && value !== undefined) {
        return { name: getName(element), elementFinder, value, elementValue, elementType: element.type };
      }
    } else if (element instanceof HTMLButtonElement && listener) {
      // Button
      return { name: getName(element), elementFinder, value: '', elementValue: element.innerText };
    } else if (element instanceof HTMLSelectElement) {
      // Select Dropdown
      const selectType = listener ? await optionListener(element) : select(element);
      if (selectType) {
        return { name: getName(element), xpath: elementFinder, elementFinder: elementFinder + selectType.optionValue, value: 'true', elementValue: selectType.elementValue };
      }
    } else if (element instanceof HTMLTextAreaElement) {
      // Textarea && Editable Content
      const value = listener ? await inputListener(element) : element.value;
      if (value) {
        return { name: getName(element), elementFinder, value };
      }
    } else if (element.isContentEditable && listener) {
      //isContentEditable
      const value = await inputListener(element);
      if (value) {
        return { elementFinder, value };
      }
    }
    return;
  };

  return { clearXpath, check };
})();
