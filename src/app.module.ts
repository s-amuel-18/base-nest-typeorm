import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ormConfig from './config/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { SeederModule } from './seeder/seeder.module';
import { ListModule } from './list/list.module';
import { AppService } from './app.service';
import { MailerModule } from './mailer/mailer.module';
import { CodeVerificationModule } from './code-verification/code-verification.module';
import { format } from 'date-fns';
import { WebsocketsModule } from './websockets/websockets.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [ormConfig],
		}),

		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) =>
				configService.get('typeorm'),
		}),
		ScheduleModule.forRoot(),
		UserModule,
		AuthModule,
		CommonModule,
		SeederModule,
		ListModule,
		MailerModule,
		CodeVerificationModule,

		WebsocketsModule,
		NotificationsModule,
		PaymentsModule,
	],
	controllers: [],
	providers: [AppService],
})
export class AppModule {}
