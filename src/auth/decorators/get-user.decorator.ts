import {
  ExecutionContext,
  InternalServerErrorException,
  Logger,
  createParamDecorator,
} from '@nestjs/common';

export const GetAuthUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const logger = new Logger('GetUser');
    const req = ctx.switchToHttp().getRequest();
    const { authUser } = req;

    if (!authUser) {
      logger.error("No existe usuario en la 'request'");
      throw new InternalServerErrorException();
    }

    return authUser;
  },
);
