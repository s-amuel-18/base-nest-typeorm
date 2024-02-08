import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CreatePassportDto } from './create-passport.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  timezone: string;

  @ApiProperty({ type: CreatePassportDto })
  @IsOptional()
  @Type(() => CreatePassportDto)
  @IsNotEmpty()
  @ValidateNested()
  passportData?: CreatePassportDto;
}
