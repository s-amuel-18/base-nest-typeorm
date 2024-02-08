import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'passports' })
export class Passport {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'user_id' })
  @ApiProperty()
  @Exclude()
  userId: number;

  @Column({ name: 'number' })
  @ApiProperty()
  number: string;

  @Column({ name: 'expiration_date' })
  @ApiProperty()
  expirationDate: string;

  @Column({ name: 'expedition_date' })
  @ApiProperty()
  expeditionDate: string;

  @Column({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;

  // * Relations
  @OneToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
