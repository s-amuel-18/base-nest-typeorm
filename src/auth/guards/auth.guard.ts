import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as moment from 'moment-timezone';

// * Services
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('AuthGuard');
  constructor(
    private jwtService: JwtService,
    readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const clientTimeZone = request.headers['client-tz'];
    const unauthorizedDefaultMsg = 'Acceso denegado.';

    if (!token) throw new UnauthorizedException(unauthorizedDefaultMsg);

    try {
      const payload = await this.authService.decryptToken(token);

      if (!payload.userId)
        throw new UnauthorizedException(unauthorizedDefaultMsg);

      const user = await this.userService.findOne(payload.userId);

      if (!user) throw new UnauthorizedException(unauthorizedDefaultMsg);

      if (clientTimeZone && user.timezone != clientTimeZone) {
        await this.userService.setTimeZone(user.id, clientTimeZone);
        user.timezone = clientTimeZone;
      }

      request['authUser'] = user;
    } catch (error) {
      this.logger.error(error);

      const statusCode = error?.status || HttpStatus.UNAUTHORIZED;
      const message = error?.message || 'Acceso denegado.';

      throw new HttpException({ message }, statusCode);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
