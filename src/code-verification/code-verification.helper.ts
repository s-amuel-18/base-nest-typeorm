import { RandomCodeOptions } from './interfaces/ramdon-code.interface';

export class CodeVerificationHelper {
  static generateRandomCode(randomCodeOptions: RandomCodeOptions = {}) {
    const { length = 6 } = randomCodeOptions;
    let code = '';
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10);
    }

    return `${code}`;
  }
}
