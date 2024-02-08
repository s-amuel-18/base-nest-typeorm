import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CodeVerificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  code: string;
}
