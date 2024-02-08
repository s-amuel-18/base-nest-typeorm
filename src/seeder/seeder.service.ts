import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Connection, DataSource, Repository } from 'typeorm';

// * Entities
import { FlightType } from 'src/list/entities/flightType.entity';
import { Gender } from 'src/list/entities/gender.entity';
import { Role } from 'src/list/entities/role.entity';
import { State } from 'src/list/entities/state.entity';
import { Country } from '../list/entities/country.entity';
import { GenderService } from '../list/services/gender.service';
import { RoleService } from '../list/services/role.service';
import { FlightTypeService } from 'src/list/services/flight-type.service';
import { CountryService } from '../list/services/country.service';
import { UserService } from '../user/services/user.service';
import { AirlineService } from 'src/list/services/airline.service';
import { NotificationTypeService } from 'src/notifications/services/notification-type.service';

@Injectable()
export class SeederService {
	private readonly logger = new Logger('SeederService');

	constructor(
		@InjectRepository(Gender)
		private readonly genderRepository: Repository<Gender>,
		@InjectRepository(Role)
		private readonly rolRepository: Repository<Role>,
		@InjectRepository(FlightType)
		private readonly flightTypeRepository: Repository<FlightType>,
		@InjectRepository(State)
		private readonly stateRepository: Repository<State>,
		@InjectRepository(Country)
		private readonly countryRepository: Repository<Country>,

		private readonly genderService: GenderService,
		private readonly roleService: RoleService,
		private readonly flightTypeService: FlightTypeService,
		private readonly countryService: CountryService,
		private readonly userService: UserService,
		private readonly airlineService: AirlineService,
		private readonly notificationTypeService: NotificationTypeService,

		private connection: DataSource,
	) {}

	async refreshDb() {
		await this.dropTables();
		await this.runMigrations();
	}

	async runSeeders() {
		// ! Esto es solo para desarrollo ES MUY PELIGRO!!!!
		await this.refreshDb();

		// * Listas
		await this.genderService.seederList();
		await this.roleService.seederList();
		await this.flightTypeService.seederList();
		await this.countryService.seederList();
		await this.airlineService.seederList();
		await this.notificationTypeService.seederList();

		// * Datos de prueba
		await this.userService.seederList();
	}

	async runMigrations() {
		await this.connection.runMigrations();
	}

	async dropTables() {
		await this.connection.dropDatabase();
	}
}
