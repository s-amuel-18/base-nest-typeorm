import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly configServive: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const errorMsg = 'Servicio no disponible en este momento';
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR; // Default status code
        if (error instanceof HttpException) {
          statusCode = error.getStatus();
        }

        if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR) {
          if (this.configServive.get('APP_ENV') === 'development') {
            throw new InternalServerErrorException({
              stack: error?.stack,
              message: errorMsg,
            });
          }
          throw new InternalServerErrorException(errorMsg);
        }

        return throwError(error);
      }),
    );
  }
}
