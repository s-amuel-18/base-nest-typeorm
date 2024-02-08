import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeVerificationHelper } from '../code-verification.helper';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { add } from 'date-fns';

@Entity({ name: 'codes-verification' })
export class CodeVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'code',
  })
  code: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'expire_at', default: add(new Date(), { minutes: 30 }) })
  expireAt: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  // * Relationship
  @OneToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
