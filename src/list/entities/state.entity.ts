import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'states' })
export class State {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'country_id' })
  @Exclude()
  countryId: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  code: string;

  // * Relations
  @OneToOne((type) => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany((type) => User, (user) => user.state)
  users: User[];
}
