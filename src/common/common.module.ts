import { Module, forwardRef } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { HttpExceptionFilter } from './filters/htto-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { UserModule } from 'src/user/user.module';
import { DatasourceService } from './services/datasource.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    DatasourceService,
  ],
  exports: [DatasourceService],
  imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule)],
})
export class CommonModule {}
