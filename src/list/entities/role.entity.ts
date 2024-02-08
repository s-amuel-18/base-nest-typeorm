import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export const adminRoleId = 1;
export const colaboratorRoleId = 2;
export const clientRoleId = 3;

export const operatorRoleIds = [adminRoleId, colaboratorRoleId];

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  code: string;

  @OneToMany((type) => User, (user) => user.role)
  user: User;
}
