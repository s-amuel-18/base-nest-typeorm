import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ required: false })
  page?: number = 0;

  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  @Min(-1)
  @ApiProperty({ required: false })
  limit?: number = 10;
}
