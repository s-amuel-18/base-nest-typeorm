import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Passport } from './entities/passport.entity';
import { ListModule } from 'src/list/list.module';
import { PassportService } from './services/passport.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Passport]),
		forwardRef(() => AuthModule),
		ListModule,
	],
	controllers: [UserController],
	providers: [UserService, PassportService],
	exports: [UserService, TypeOrmModule, PassportService],
})
export class UserModule {}
