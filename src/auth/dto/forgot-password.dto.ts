import { NewPasswordDto } from 'src/user/dto/change-password.dto';
import { CodeVerificationDto } from './code-verification.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPasswordChangePasswordDto extends NewPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  code: string;
}
