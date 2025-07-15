/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent } from 'react';
import { IN_VALID_CLASS, NUMBER_FIELDS } from './validation';

const getFieldNameValue = <T = any>(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, data?: any): { name: string; value: T } | null => {
  if (e.target.classList.contains(IN_VALID_CLASS)) {
    return null;
  }

  const { name, type, value } = e.target;
  let currentValue: any = value;
  if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
    currentValue = e.target.checked;
  } else if (NUMBER_FIELDS.includes(name) && value.indexOf('e') === -1) {
    currentValue = Number(value);
  }
  if (data && data[name] === value) {
    return null;
  }

  return { name, value: currentValue };
};

const updateForm = (formId: string, data: any) => {
  const form = document.querySelector(`#${formId}`) as HTMLFormElement;
  if (form) {
    Array.from(form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement) {
        if (element.type === 'radio') {
          element.checked = data?.[element.name] === element.value;
        } else if (element.type !== 'checkbox') {
          element.value = data?.[element.name] || '';
        }
      }
    });
  }
};

export { getFieldNameValue, updateForm };
