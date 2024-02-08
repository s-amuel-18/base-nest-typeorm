import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
// * Services
import { AuthService } from './auth.service';

// * Modules
import { UserModule } from 'src/user/user.module';
import { MailerModule } from 'src/mailer/mailer.module';

// * Guard
import { AuthGuard } from './guards/auth.guard';
import { CodeVerificationModule } from 'src/code-verification/code-verification.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
    }),
    MailerModule,
    CodeVerificationModule,
  ],
  exports: [AuthGuard, JwtModule, AuthService],
})
export class AuthModule {}
