import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationType } from '../entities/notification-type.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationTypeService {
  logger = new Logger('NotificationTypeService');
  constructor(
    @InjectRepository(NotificationType)
    private readonly notificationTypeRepo: Repository<NotificationType>,
  ) {}

  async findAll() {
    return await this.notificationTypeRepo.find();
  }

  async seederList() {
    try {
      const arrNotificationTypes = [
        { name: 'Recordatorios' }, // * 1
        { name: 'Comunicaciones' }, // * 2
      ];
      await this.notificationTypeRepo.save(arrNotificationTypes);
    } catch (error) {
      throw new Error(error);
    }
  }
}
