/* eslint max-len: ["error", { "code": 200 }] */
export const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|[+|-]([\d|:]*))?$/;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dateParser = (_: any, value: any) => {
  if (typeof value === 'string') {
    const a = reISO.exec(value);
    if (a) {
      return new Date(value);
    }
  }
  return value;
};
