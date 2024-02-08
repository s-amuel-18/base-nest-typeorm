import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class ReadNotificationDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1)
  readAll: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  notificationId: number;
}
