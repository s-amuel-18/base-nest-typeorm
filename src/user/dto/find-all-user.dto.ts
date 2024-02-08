import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllUserDto extends PaginationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  roleId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  genderId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  createdByUserId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  stateId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  countryId?: number;
}
