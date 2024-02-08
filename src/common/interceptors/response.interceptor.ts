import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from '@nestjs/common';
import { Observable, lastValueFrom, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';

export interface Response<T> {
  data: object;
  message?: string;
  token?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly authService: AuthService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const allData = (await lastValueFrom(next.handle())) || {};

    const { data = {}, message = '', token = null } = allData;

    const response = context.switchToHttp().getResponse();

    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;

    const currentToken =
      !!bearerToken && bearerToken.length > 0
        ? bearerToken.split(' ')[1]
        : null;

    const revalidatedToken =
      token || (await this.authService.revalidateToken(currentToken));

    return of({
      statusCode: response.statusCode,
      token: revalidatedToken,
      message,
      data,
      errors: [],
    });
  }
}
