import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirmNewPassword: string;
}
export class ChangePasswordDto extends NewPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
