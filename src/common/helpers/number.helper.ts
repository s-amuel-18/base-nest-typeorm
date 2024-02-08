import * as moment from 'moment-timezone';
import * as currencyFormatter from 'currency-formatter';

export class NumberHelper {
  static parsePhoneNumberToInt(phoneNum: string) {
    return +phoneNum.replace(/\+/g, '');
  }

  static amountFormatter(amount: number, currency: string) {
    return currencyFormatter.format(amount, {
      code: currency,
    });
  }
}
