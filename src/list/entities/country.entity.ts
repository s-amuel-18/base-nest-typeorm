import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { State } from './state.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  code: string;

  @OneToMany((type) => State, (state) => state.country)
  states: State[];
}
