import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '11111111' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
