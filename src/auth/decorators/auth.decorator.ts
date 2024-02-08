import { UseGuards, applyDecorators } from '@nestjs/common';
import { RoleProtected } from 'src/user/decorators/role-protected.decorator';
import { ValidRoles } from 'src/user/interfaces/valid-roles.interface';
import { AuthGuard } from '../guards/auth.guard';
import { UserRoleGuard } from 'src/user/guards/user-role.guard';
import { AuthOptions } from '../interfaces/auth-options.interface';
import { ApiSecurity } from '@nestjs/swagger';

export function Auth(authOptions: AuthOptions = {}) {
  const { allowedRoles = [] } = authOptions;
  return applyDecorators(
    RoleProtected(...allowedRoles),
    ApiSecurity('basic'),
    UseGuards(AuthGuard, UserRoleGuard),
  );
}
