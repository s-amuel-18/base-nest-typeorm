import { InternalServerErrorException, Logger } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

export class ErrorExceptionHelper {
  constructor(private title: string) {}

  handleException(error: any) {
    const logger = new Logger(this.title);
    logger.error(error);
    if (process.env.APP_ENV && process.env.APP_ENV === 'development') {
      throw new InternalServerErrorException({
        data: { error: error.message },
      });
    }

    throw new InternalServerErrorException();
  }
}
