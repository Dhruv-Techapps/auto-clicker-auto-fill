export class DateUtil {
  static getDateWithoutTime(date = new Date()) {
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
