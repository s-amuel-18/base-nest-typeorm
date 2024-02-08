import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';

export class FindAllResponse {
  @ApiProperty({ type: [Notification] })
  notifications: Notification[];
}
