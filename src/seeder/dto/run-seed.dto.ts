import { Equals, IsNotEmpty, IsString } from 'class-validator';

export class RunSeedDto {
  @IsString()
  @IsNotEmpty()
  @Equals('mi_password_except', {
    message: 'Contraseña incorrecta',
  })
  password: string;
}
