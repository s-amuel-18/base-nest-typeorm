import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationTypesAllowed } from './entities/notification-type.entity';
import { WSEvents } from 'src/websockets/interfaces/ws-events.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetAuthUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { FindAllResponse } from './interfaces/response.interface';
import { FindAllNotificationDto } from './dto/find-all-notification.dto';
import { ReadNotificationDto } from './dto/read-notifications.dto';
import { ContentTypeNotification } from './interfaces/notification.interface';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('test')
  @Auth()
  async test(@GetAuthUser() user: User) {
    const notification = await this.notificationsService.create(user.id, {
      title: 'NOTIFICACIÓN DE PRUEBA',
      description: 'Esta es una notificación de prueba.',
      notificationTypeId: NotificationTypesAllowed.reminder,
      content: { type: ContentTypeNotification.newNotification, id: 1 },
    });
    return { data: { notification } };
  }

  @Get()
  @ApiOperation({ summary: 'Lista de notificaciones' })
  @ApiResponse({ status: 200, type: FindAllResponse })
  @Auth()
  async findAll(
    @Query() findAllNotificationDto: FindAllNotificationDto,
    @GetAuthUser() user: User,
  ) {
    const notifications = await this.notificationsService.findAll(
      user.id,
      findAllNotificationDto,
    );
    return { data: { notifications } };
  }

  @Patch('read')
  @ApiOperation({ summary: 'Actualizar notificaciones a leidas' })
  @ApiResponse({ status: 200 })
  @Auth()
  async read(
    @Body() readNotificationDto: ReadNotificationDto,
    @GetAuthUser() user: User,
  ) {
    const notifications = await this.notificationsService.readNotification(
      user.id,
      readNotificationDto,
    );
    return { message: 'Notificaciones leidas.' };
  }
}
