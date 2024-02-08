import { Point } from 'typeorm';
import { NotificationContent } from '../entities/notification.entity';

export class CreateNotificationDto {
  notificationTypeId: number;
  title: string;
  description: string;
  content: NotificationContent;
}
