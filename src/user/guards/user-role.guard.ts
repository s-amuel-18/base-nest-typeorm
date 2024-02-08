import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserRoleGuard implements CanActivate {
  private readonly logger = new Logger('UserRoleGuard');

  constructor(private readonly reflector: Reflector) {}
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(META_ROLES, ctx.getHandler());

    if (!roles) {
      this.logger.error('No existen roles');
      throw new InternalServerErrorException();
    }

    if (roles.length == 0) return true;

    const { authUser } = ctx.switchToHttp().getRequest();

    if (!authUser) throw new UnauthorizedException();

    if (!authUser.role)
      throw new UnauthorizedException('No tiene los permisos necesarios');

    if (roles.includes(authUser.role.code)) return true;

    throw new UnauthorizedException('No tiene los permisos necesarios');
  }
}
