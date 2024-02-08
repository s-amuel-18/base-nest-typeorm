import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/gender.entity';
import { Role } from '../entities/role.entity';
import { FlightType } from '../entities/flightType.entity';
import { Country } from '../entities/country.entity';
import { State } from '../entities/state.entity';

import { Airline } from '../entities/airline.entity';
import { NotificationType } from 'src/notifications/entities/notification-type.entity';

export class GenderListResponse {
	@ApiProperty({ type: [Gender] })
	genders: Gender[];
}

export class RoleListResponse {
	@ApiProperty({ type: [Role] })
	roles: Role[];
}

export class FlightTypeResponse {
	@ApiProperty({ type: [FlightType] })
	flightTypes: FlightType[];
}

export class CountriesResponse {
	@ApiProperty({ type: [Country] })
	countries: Country[];
}

export class StatesResponse {
	@ApiProperty({ type: [State] })
	states: State[];
}

export class AirlineResponse {
	@ApiProperty({ type: [Airline] })
	airlines: Airline[];
}

export class NotificationTypeResponse {
	@ApiProperty({ type: [NotificationType] })
	notificationTypes: NotificationType[];
}
