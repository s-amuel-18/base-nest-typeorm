import { Module, forwardRef } from '@nestjs/common';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from './entities/gender.entity';
import { Role } from './entities/role.entity';
import { FlightType } from './entities/flightType.entity';
import { GenderService } from './services/gender.service';
import { RoleService } from './services/role.service';
import { FlightTypeService } from './services/flight-type.service';
import { StateService } from './services/state.service';
import { State } from './entities/state.entity';
import { Country } from './entities/country.entity';
import { CountryService } from './services/country.service';
import { Airline } from './entities/airline.entity';
import { AirlineService } from './services/airline.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Gender,
			Role,
			FlightType,
			State,
			Country,
			Airline,
		]),
		forwardRef(() => NotificationsModule),
	],
	controllers: [ListController],
	providers: [
		GenderService,
		RoleService,
		FlightTypeService,
		StateService,
		CountryService,
		AirlineService,
	],
	exports: [
		TypeOrmModule,
		GenderService,
		RoleService,
		FlightTypeService,
		StateService,
		CountryService,
		AirlineService,
	],
})
export class ListModule {}
