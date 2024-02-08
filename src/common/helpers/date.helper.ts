import {
  eachMonthOfInterval,
  endOfYear,
  format,
  startOfYear,
  subDays,
} from 'date-fns';
import * as moment from 'moment-timezone';

export class DateHelper {
  static dateToUTC(date: Date, timezone: string): Date {
    let fechaCaracas = moment.tz(date, timezone);

    let fechaUTC = fechaCaracas.clone().utc();
    return fechaUTC.toDate();
  }

  static dateFormatToUtcDate(dateString: string, format: string) {
    return moment.utc(dateString, format).toDate();
  }

  static dateIsoStringToUtcDate(dateString: string) {
    return this.dateFormatToUtcDate(dateString, 'YYYY-MM-DD HH:mm:ss');
  }

  static UTCdateToTimezoneDate(
    date: Date,
    timezone: string,
    format: string = null,
  ) {
    const localDate = moment.tz(date, timezone);
    return localDate.format(format);
  }

  static allMonthsOfYear() {
    const today = new Date();
    const startDate = startOfYear(today);
    const endDate = endOfYear(today);

    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    const formattedMonths = months.map((month) => format(month, 'yyyy-MM-dd'));
    return formattedMonths.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }

  static getPreviousDates(date: Date, countDays: number = 7) {
    const dates = [];

    for (let i = 0; i < countDays; i++) {
      const previousDate = subDays(date, i + 1);
      dates.push(format(previousDate, 'yyyy-MM-dd'));
    }

    return dates;
  }
}
