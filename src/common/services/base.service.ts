import { HttpException, Logger } from '@nestjs/common';

export abstract class BaseService {
  protected handleException(error: Error | HttpException, data?: any) {
    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      const resp = error.getResponse();
      const message = resp['message'] || resp['error'];
      throw new HttpException({ message }, statusCode);
    }

    const logger = new Logger(this.constructor.name);
    logger.error(error.message);

    throw error;
  }
}
