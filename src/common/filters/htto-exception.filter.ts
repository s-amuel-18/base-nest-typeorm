import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { isArray, isString } from 'class-validator';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly authService: AuthService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const responseMsg = exception.getResponse()['message'];

    let errors = exception.getResponse()['errors'] || [];
    if (errors.length == 0) {
      if (!!responseMsg && isArray(responseMsg)) errors = responseMsg;
      else if (isString(responseMsg)) errors = [responseMsg];
    }

    const bearerToken = request.headers.authorization;

    const currentToken =
      !!bearerToken && bearerToken.length > 0
        ? bearerToken.split(' ')[1]
        : null;

    const revalidatedToken = await this.authService.revalidateToken(
      currentToken,
    );

    const { httpAdapter } = this.httpAdapterHost;

    const message = isString(responseMsg)
      ? responseMsg
      : errors.length > 0
      ? errors[0]
      : '';
    response.status(status).json({
      statusCode: status,
      message,
      errors,
      token: revalidatedToken,
      data: exception.getResponse()['data'] || {},
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      stack: exception.getResponse()['stack'] || '',
    });
  }
}
