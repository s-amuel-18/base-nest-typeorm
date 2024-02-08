import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  NotificationType,
  NotificationTypesAllowed,
} from './notification-type.entity';
import { User } from 'src/user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { ContentTypeNotification } from '../interfaces/notification.interface';

export class NotificationContent {
  type?: ContentTypeNotification;
  id?: number;
}

@Entity({ name: 'notifications' })
export class Notification {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'notification_type_id' })
  @Exclude()
  notificationTypeId: NotificationTypesAllowed;

  @ApiProperty()
  @Column({ name: 'user_id' })
  @Exclude()
  userId: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column('jsonb')
  content: NotificationContent;

  @ApiProperty()
  @Column({ name: 'is_read' })
  isRead: boolean;

  @ApiProperty()
  @Column({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Column({ name: 'updated_at' })
  updatedAt: Date;

  // * Relationship
  @OneToOne((type) => NotificationType, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'notification_type_id' })
  notificationType: NotificationType;

  @OneToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
