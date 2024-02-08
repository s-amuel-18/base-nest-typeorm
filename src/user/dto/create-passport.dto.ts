import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePassportDto {
  @ApiProperty({ example: '11111111' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  number: string;

  @ApiProperty({ example: '2000-12-12' })
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;

  @ApiProperty({ example: '2000-12-12' })
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  expeditionDate: string;
}
