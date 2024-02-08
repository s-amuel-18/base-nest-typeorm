import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './entities/notification-type.entity';
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { NotificationTypeService } from './services/notification-type.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Notification, NotificationType]),
		forwardRef(() => WebsocketsModule),
		forwardRef(() => AuthModule),
		forwardRef(() => UserModule),
	],
	controllers: [NotificationsController],
	providers: [NotificationsService, NotificationTypeService],
	exports: [NotificationTypeService, NotificationsService],
})
export class NotificationsModule {}
