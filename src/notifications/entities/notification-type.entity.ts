import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './notification.entity';

export enum NotificationTypesAllowed {
  reminder = 1,
  communications = 2,
}

@Entity({ name: 'notification-types' })
export class NotificationType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @OneToMany(
    (type) => Notification,
    (notification) => notification.notificationType,
  )
  notifications: Notification[];
}
