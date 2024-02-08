import { ValidRoles } from 'src/user/interfaces/valid-roles.interface';

export interface AuthOptions {
  allowedRoles?: ValidRoles[];
}
