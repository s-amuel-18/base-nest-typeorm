import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { ListModule } from 'src/list/list.module';
import { UserModule } from 'src/user/user.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
	controllers: [SeederController],
	providers: [SeederService],
	imports: [ListModule, UserModule, NotificationsModule],
})
export class SeederModule {}
