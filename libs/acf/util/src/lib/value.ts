import { Sheets } from '@dhruv-techapps/google-sheets';
import RandExp from 'randexp';

declare global {
  interface Window {
    __batchRepeat: number;
    __actionRepeat: number;
    __sessionCount: number;
    __sheets?: Sheets;
    __api?: { [key: string]: string };
  }
}

export const VALUE_MATCHER = {
  QUERY_PARAM: /^Query::/i,
  API: /^Api::/i,
  RANDOM: /<random(.+)>/gi,
  BATCH_REPEAT: /<batchRepeat>/,
  ACTION_REPEAT: /<actionRepeat>/,
  SESSION_COUNT: /<sessionCount>/,
};

export const Value = (() => {
  const getRandomValue = (value: string) =>
    value.replace(VALUE_MATCHER.RANDOM, (_, regex) => {
      const randexp = new RandExp(regex, 'i');
      randexp.defaultRange.add(0, 65535);
      const result = randexp.gen();
      return result;
    });

  const getBatchRepeat = (value: string) => value.replaceAll('<batchRepeat>', String(window.__batchRepeat));

  const getActionRepeat = (value: string) => value.replaceAll('<actionRepeat>', String(window.__actionRepeat));

  const getSessionCount = (value: string) => value.replaceAll('<sessionCount>', String(window.__sessionCount));

  const getQueryParam = (value: string) => {
    const [, key] = value.split('::');
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(key)) {
      value = searchParams.get(key) || key;
    }
    return value;
  };

  const getApiValue = (value: string): string => {
    const [, key] = value.split('::');
    const apiValue = window.__api?.[key];
    if (apiValue) {
      return apiValue;
    }
    return value;
  };

  const getValue = async (value: string): Promise<string> => {
    /// For select box value is boolean true
    if (typeof value !== 'string') {
      return value;
    }

    if (VALUE_MATCHER.QUERY_PARAM.test(value)) {
      value = getQueryParam(value);
    }
    if (VALUE_MATCHER.BATCH_REPEAT.test(value)) {
      value = getBatchRepeat(value);
    }
    if (VALUE_MATCHER.ACTION_REPEAT.test(value)) {
      value = getActionRepeat(value);
    }
    if (VALUE_MATCHER.API.test(value)) {
      value = getApiValue(value);
    }
    if (VALUE_MATCHER.SESSION_COUNT.test(value)) {
      value = getSessionCount(value);
    }
    if (VALUE_MATCHER.RANDOM.test(value)) {
      value = getRandomValue(value);
    }
    if (VALUE_MATCHER.API.test(value)) {
      value = getApiValue(value);
    }
    return value;
  };

  return { getValue, getBatchRepeat, getActionRepeat, getSessionCount };
})();