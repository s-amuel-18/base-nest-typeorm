import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const economicFlightType = 1;
export const executiveFlightType = 2;

@Entity({ name: 'flight-types' })
export class FlightType {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  code: string;
}
