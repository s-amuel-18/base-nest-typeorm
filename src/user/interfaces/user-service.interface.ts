import { User } from '../entities/user.entity';

// * Interfaces para operaciones realizadas por operadores del sistema entre otros usuarios
export interface userOperations {
  operatorUser: User;
  userId: number;
}

export interface RelatedUsers {
  // * Usuario creador
  creatorUserId: number;

  // * Usuario creado
  userId: number;
}

export interface ChangePasswordOptions {
  userId: number;
  actualPassword: string;
  newPassword: string;
}
