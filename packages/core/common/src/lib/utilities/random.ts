export const getRandomValues = () => {
  const arr = crypto.getRandomValues(new Uint32Array(1));
  const mantissa = arr[0] * Math.pow(2, 20) + (arr[1] >>> 12);
  return mantissa * Math.pow(2, -52);
};

export type RANDOM_UUID = `${string}-${string}-${string}-${string}-${string}`;

export const generateUUID = (): RANDOM_UUID => {
  // Generate a random UUID (version 4)
  return crypto.randomUUID
    ? crypto.randomUUID()
    : ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (getRandomValues() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) as RANDOM_UUID);
};

export const isValidUUID = (uuid: unknown) => {
  if (typeof uuid !== 'string') {
    return false;
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
