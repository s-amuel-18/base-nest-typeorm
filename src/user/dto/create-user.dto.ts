import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { onlyNumberAndPlus } from 'src/common/constants/exp.constant';

export class CreateUserDto extends SignUpDto {
  @ApiProperty({ example: 'Nombre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'Segundo Nombre', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  secondName?: string;

  @ApiProperty({ example: 'Apellido', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  surname?: string;

  @ApiProperty({ example: 'Segundo Apellido', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  secondSurname?: string;

  @ApiProperty({ example: '+584242343456', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Transform(({ value }: TransformFnParams) =>
    value.replace(onlyNumberAndPlus, ''),
  )
  secondPhoneNumber?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsInt()
  @Min(1)
  genderId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsInt()
  @Min(1)
  stateId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsInt()
  @Min(1)
  roleId: number;

  @ApiProperty({ example: '32432345' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  taxIdentification: string;

  @ApiProperty({ example: 'Mi Dirección' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  residenceAddress: string;

  @ApiProperty({ example: 'Mi ciudad' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  residenceCity: string;

  @ApiProperty({ example: '1010' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  postalCode: string;

  @ApiProperty({ example: '2000-12-12' })
  @IsDateString()
  @IsNotEmpty()
  birthdate: string;
}
