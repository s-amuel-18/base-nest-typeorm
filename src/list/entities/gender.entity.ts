import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'genders' })
export class Gender {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  code: string;

  @OneToMany((type) => User, (user) => user.gender)
  user: User;
}
