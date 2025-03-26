type RegexType = {
  [index: string]: string;
};

const REGEX: RegexType = {
  NUMBER: '^-?\\d+$',
  INTERVAL: '^(([\\d]+[.])?[\\d]+e)?([\\d]+[.])?[\\d]+$',
  SCHEDULE_DATE:'^20\\d{2}-(0[1-9]|1[1,2])-(0[1-9]|[12][0-9]|3[01])$',
  SCHEDULE_TIME: '^(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{3}$',
  SCHEDULE_REPEAT: '^\\d+$',
  HOT_KEY: '^(Ctrl \\+ |Alt \\+ |Shift \\+ )+\\D$',
};
export { REGEX };
