import {
  IsEmail,
  MinLength,
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsPhoneNumber,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { onlyNumberAndPlus } from 'src/common/constants/exp.constant';
import { Max } from 'class-validator';
export class SignUpDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsString()
  @MinLength(1)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+5842434567654' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Transform(({ value }: TransformFnParams) =>
    value.replace(onlyNumberAndPlus, ''),
  )
  phoneNumber?: string;

  @ApiProperty({ example: 'xxxxxxxx' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'Samuel graterol' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;
}
