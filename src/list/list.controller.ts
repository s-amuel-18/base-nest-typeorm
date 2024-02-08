import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// * Interfaces
import {
	AirlineResponse,
	CountriesResponse,
	FlightTypeResponse,
	GenderListResponse,
	NotificationTypeResponse,
	RoleListResponse,
	StatesResponse,
} from './interfaces/list-response.interface';

// * Services
import { GenderService } from './services/gender.service';
import { RoleService } from './services/role.service';
import { FlightTypeService } from './services/flight-type.service';
import { CountryService } from './services/country.service';
import { StateService } from './services/state.service';
import { AirlineService } from './services/airline.service';
import { NotificationTypeService } from 'src/notifications/services/notification-type.service';

@Controller('list')
@ApiTags('Lists')
export class ListController {
	constructor(
		private readonly genderService: GenderService,
		private readonly roleService: RoleService,
		private readonly flightTypeService: FlightTypeService,
		private readonly countryService: CountryService,
		private readonly stateService: StateService,
		private readonly airlineService: AirlineService,
		private readonly notificationTypeService: NotificationTypeService,
	) {}

	@Get('genders')
	@ApiOperation({ summary: 'Lista de generos' })
	@ApiResponse({ status: 200, type: GenderListResponse })
	async genderList() {
		const genders = await this.genderService.findAll();
		return {
			data: { genders },
		};
	}

	@Get('roles')
	@ApiOperation({ summary: 'Lista de roles' })
	@ApiResponse({ status: 200, type: RoleListResponse })
	async roleList() {
		const roles = await this.roleService.findAll();
		return {
			data: { roles },
		};
	}

	@Get('flight-types')
	@ApiOperation({ summary: 'Lista de tipos de vuelo' })
	@ApiResponse({ status: 200, type: FlightTypeResponse })
	async flightTypeList() {
		const flightTypes = await this.flightTypeService.findAll();
		return {
			data: { flightTypes },
		};
	}

	@Get('countries')
	@ApiOperation({ summary: 'Lista de paises' })
	@ApiResponse({ status: 200, type: CountriesResponse })
	async countriesList() {
		const countries = await this.countryService.findAll();
		return {
			data: { countries },
		};
	}

	@Get('country/:id/states')
	@ApiOperation({ summary: 'Lista de estados por country ID' })
	@ApiResponse({ status: 200, type: StatesResponse })
	async statesListByCountry(@Param('id', ParseIntPipe) id: number) {
		const states = await this.stateService.findByCountryId(id);
		return {
			data: { states },
		};
	}

	@Get('airlines/')
	@ApiOperation({ summary: 'Lista de areolineas' })
	@ApiResponse({ status: 200, type: AirlineResponse })
	async airlineList() {
		const airlines = await this.airlineService.findAll();

		return {
			data: { airlines },
		};
	}

	@Get('notification-types')
	@ApiOperation({ summary: 'Lista de tipos de notificaciones' })
	@ApiResponse({ status: 200, type: NotificationTypeResponse })
	async notificationTypeList() {
		const notificationTypes = await this.notificationTypeService.findAll();

		return {
			data: { notificationTypes },
		};
	}
}
