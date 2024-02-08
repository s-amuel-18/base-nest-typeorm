import {
	InternalServerErrorException,
	BadRequestException,
	Injectable,
	NotFoundException,
	Logger,
	Inject,
	forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Not, Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import * as moment from 'moment-timezone';

// * DTOs
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { ChangePasswordDto, NewPasswordDto } from '../dto/change-password.dto';
import { FindAllUserDto } from '../dto/find-all-user.dto';

// * Entities
import { User, countBookingPerUser } from '../entities/user.entity';
import {
	adminRoleId,
	clientRoleId,
	colaboratorRoleId,
	operatorRoleIds,
} from 'src/list/entities/role.entity';

// * Interfaces
import { FinderOptions } from 'src/common/interfaces/services.interface';
import {
	RelatedUsers,
	userOperations,
} from '../interfaces/user-service.interface';

// * Services
import { GenderService } from '../../list/services/gender.service';
import { StateService } from 'src/list/services/state.service';
import { PassportService } from './passport.service';
import { map } from 'rxjs/operators';
import { addYears, format, subYears } from 'date-fns';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UserService extends BaseService {
	private readonly logger = new Logger('UserService');

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		private readonly genderService: GenderService,
		private readonly stateService: StateService,

		@Inject(forwardRef(() => PassportService))
		private readonly passportService: PassportService,
	) {
		super();
	}

	// * Creators
	async signUp(signUpDto: SignUpDto): Promise<User> {
		await this.throwExceptionIfEmailExist(signUpDto.email);
		if (signUpDto.phoneNumber)
			await this.throwExceptionIfPhoneNumberExist(signUpDto.phoneNumber);

		try {
			const newUser = this.userRepository.create({
				...signUpDto,
				roleId: clientRoleId,
			});
			await this.userRepository.save(newUser);
			return await this.findOne(newUser.id);
		} catch (error) {
			this.handleException(error);
		}
	}

	async create(user: User, createUserDto: CreateUserDto) /* : Promise<User> */ {
		// await this.throwExceptionIfEmailExist(createUserDto.email);
		// await this.throwExceptionIfPhoneNumberExist(createUserDto.phoneNumber);

		try {
			const roleId = user.isAdmin() ? createUserDto.roleId : clientRoleId;
			const newUser = this.userRepository.create({
				...createUserDto,
				createdByUserId: user.id,
				roleId,
			});
			await this.userRepository.save(newUser);
			return await this.findOne(newUser.id);
		} catch (error) {
			this.handleException(error);
		}
	}

	// * Finders
	async findAll(
		operatorUser: User,
		findAllUserDto: FindAllUserDto = {},
	): Promise<{ count: number; rows: User[] }> {
		const {
			page = 0,
			limit = 10,
			search = null,
			roleId = null,
			stateId = null,
			createdByUserId = null,
			genderId = null,
			countryId = null,
		} = findAllUserDto;

		const take = limit > -1 ? limit : null;
		const skip = limit > -1 ? page * limit : null;

		const query = this.userRepository
			.createQueryBuilder()
			.leftJoinAndSelect('User.gender', 'gender')
			.leftJoinAndSelect('User.role', 'role')
			.leftJoinAndSelect('User.passport', 'passport')
			.leftJoinAndSelect('User.state', 'state')
			.leftJoinAndSelect('state.country', 'country')
			.where('User.id != :userId', { userId: operatorUser.id })
			.take(take)
			.skip(skip);

		if (search)
			query.andWhere(
				new Brackets((qb) => {
					const searchable = `%${search}%`;
					qb.where('User.name ILIKE :s', { s: searchable })
						.orWhere('User.surname ILIKE :s', { s: searchable })
						.orWhere('User.secondSurname ILIKE :s', { s: searchable })
						.orWhere('User.phoneNumber ILIKE :s', { s: searchable })
						.orWhere('User.secondPhoneNumber ILIKE :s', { s: searchable })
						.orWhere('User.residenceAddress ILIKE :s', { s: searchable })
						.orWhere('User.residenceCity ILIKE :s', { s: searchable })
						.orWhere('User.postalCode ILIKE :s', { s: searchable })
						.orWhere('User.taxIdentification ILIKE :s', { s: searchable })
						.orWhere('User.email ILIKE :s', { s: searchable });
				}),
			);

		if (roleId) query.andWhere('User.roleId = :roleId', { roleId });
		if (stateId) query.andWhere('User.stateId = :stateId', { stateId });
		if (countryId)
			query.andWhere('state.countryId = :countryId', { countryId });
		if (genderId) query.andWhere('User.genderId = :genderId', { genderId });
		if (createdByUserId)
			query.andWhere('User.createdByUserId = :createdByUserId', {
				createdByUserId,
			});

		const [rows, count] = await query.getManyAndCount();

		return { count, rows };
	}

	async findOperators() {
		const users = await this.userRepository.find({
			where: {
				roleId: In(operatorRoleIds),
			},
		});
		return users;
	}

	async findOne(id: number, finderOptions: FinderOptions = {}) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'El usuario no se encuentra registrado.',
			withRelations = true,
		} = finderOptions;

		const user = await this.userRepository.findOne({
			where: { id },
			...(withRelations
				? { relations: { ...User.withDetails().relations } }
				: {}),
		});

		if (user) return user;
		if (throwExceptionIfNotFound && !user)
			throw new NotFoundException(notFoundExceptionMessage);
		return null;
	}

	async findByPhoneNumber(
		phoneNumber: string,
		finderOptions: FinderOptions = {},
	) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'El usuario no se encuentra registrado.',
			withRelations = true,
		} = finderOptions;

		const user = await this.userRepository.findOne({
			where: { phoneNumber },
			...(withRelations
				? { relations: { ...User.withDetails().relations } }
				: {}),
		});

		if (user) return user;

		if (throwExceptionIfNotFound && !user)
			throw new NotFoundException(notFoundExceptionMessage);
		return null;
	}

	async findByEmail(email: string, finderOptions: FinderOptions = {}) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'El usuario no se encuentra registrado.',
			withRelations = true,
		} = finderOptions;

		const user = await this.userRepository.findOne({
			where: { email },
			...(withRelations
				? { relations: { ...User.withDetails().relations } }
				: {}),
		});

		if (user) return user;

		if (throwExceptionIfNotFound && !user)
			throw new NotFoundException(notFoundExceptionMessage);
		return null;
	}

	// * Updaters
	async updateByOperatorUser(
		userOperations: userOperations,
		updateUserDto: UpdateUserDto,
	) {
		const { operatorUser, userId } = userOperations;

		if (operatorUser.isAdmin()) return await this.update(userId, updateUserDto);

		if (operatorUser.isColaborator()) {
			await this.throwExceptionIfIsNotUserCreator({
				creatorUserId: operatorUser.id,
				userId,
			});
			delete updateUserDto.roleId;
			return await this.update(userId, updateUserDto);
		}
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.findOne(id, {
			withRelations: false,
			throwExceptionIfNotFound: true,
		});
		const { passportData, ...userData } = updateUserDto;

		if (userData.stateId)
			// * Throw exception if not exist
			await this.stateService.findById(userData.stateId);

		if (userData.genderId)
			// * Throw exception if not exist
			await this.genderService.findById(userData.genderId);

		const userMerged = this.userRepository.merge(user, userData);

		if (passportData)
			await this.passportService.createOrUpdate(user.id, passportData);

		try {
			await this.userRepository.save(userMerged);

			return await this.findOne(id);
		} catch (error) {
			this.handleException(error);
		}
	}

	async changePasswirdByActualPassword(
		userId: number,
		changePasswordDto: ChangePasswordDto,
	) {
		const user = await this.findOne(userId, { withRelations: false });
		this.throwExceptionIfPasswordIsInvalid(user, changePasswordDto.oldPassword);

		try {
			await this.changePassword(user, changePasswordDto);
		} catch (error) {
			this.handleException(error);
		}
	}

	async setTimeZone(userId: number, timezone: string) {
		if (!moment.tz.names().includes(timezone))
			throw new BadRequestException('La zona horaria del usuario no es valida');

		await this.update(userId, { timezone });
	}

	// * Questions
	async exist(id: number, finderOptions: FinderOptions = {}) {
		return await this.userRepository.exist({ where: { id } });
	}

	async isHisCreatorUser(relatedUsers: RelatedUsers) {
		const exist = await this.userRepository.exist({
			where: {
				id: relatedUsers.userId,
				createdByUserId: relatedUsers.creatorUserId,
			},
		});
		return exist;
	}

	async hasPassport(userId: number): Promise<boolean> {
		const passport = await this.passportService.findByUserId(userId, {
			throwExceptionIfNotFound: false,
		});

		return !passport;
	}

	async changePassword(user: User, newPasswordDto: NewPasswordDto) {
		const { confirmNewPassword, newPassword } = newPasswordDto;

		if (confirmNewPassword !== newPassword)
			throw new BadRequestException('Las contraseñas no coinciden.');

		const userMerged = this.userRepository.merge(user, {
			password: newPasswordDto.newPassword,
		});

		await this.userRepository.save(userMerged);
	}

	// * Reports
	async listUserReport(
		authUser: User,
		findAllUserDto: FindAllUserDto = {},
	): Promise<Buffer> {
		const users = await this.findAll(authUser, {
			...findAllUserDto,
			limit: -1,
		});
		try {
			const defaultValue = '----------------';

			const dataXLSX = users.rows.map((user) => {
				let data = {
					Nombre: user.name,
					'Segundo nombre': user.secondName,
					Apellído: user.surname,
					'Segundo apellído': user.secondSurname,
					'Correo electrónico': user.email,
					Genero: user?.gender?.name,
					Rol: user.role.name,
					'Número de cedula': user.taxIdentification,
					País: user?.state?.country?.name,
					Estado: user?.state?.name,
					'Número telefónico': user.phoneNumber,
					'Número telefónico secundario': user.phoneNumber,
					'Dirección residencial': user.residenceAddress,
					'Codigo postal': user.postalCode,
					'Fecha de nacimiento': user.birthdate
						? format(new Date(user.birthdate), 'dd/MM/yyyy')
						: null,
				};

				for (const key in data) {
					const value = data[key];
					data[key] = value || defaultValue;
				}

				return data;
			});

			const workbook = xlsx.utils.book_new();
			const worksheet = xlsx.utils.json_to_sheet(dataXLSX);
			xlsx.utils.book_append_sheet(workbook, worksheet, 'Hoja 1');

			return xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
		} catch (error) {
			this.handleException(error);
		}
	}

	// * Deleters
	remove(id: number) {
		return `This action removes a #${id} user`;
	}

	// * Exceptions
	async throwExceptionIfIsNotUserCreator(
		relatedUsers: RelatedUsers,
		exceptionMessage = 'No tiene los permisos necesarios',
	) {
		const isHisUserCreator = await this.isHisCreatorUser(relatedUsers);
		if (!isHisUserCreator) throw new BadRequestException(exceptionMessage);
	}

	throwExceptionIfPasswordIsInvalid(user: User, password: string) {
		if (!user.verifyPassword(password))
			throw new BadRequestException('La contraseña anterior no es valida.');
	}

	async throwExceptionIfEmailNotExist(email: string) {
		await this.findByEmail(email, {
			throwExceptionIfNotFound: true,
			withRelations: false,
			notFoundExceptionMessage:
				'El correo electrónico no se encuentra registrado',
		});
	}

	async throwExceptionIfEmailExist(email: string) {
		const user = await this.findByEmail(email, {
			throwExceptionIfNotFound: false,
			withRelations: false,
		});
		if (user)
			throw new BadRequestException(
				'El correo electrónico ya se encuentra registrado',
			);
	}

	async throwExceptionIfPhoneNumberExist(phoneNumber: string) {
		const user = await this.findByPhoneNumber(phoneNumber, {
			throwExceptionIfNotFound: false,
			withRelations: false,
		});

		if (user)
			throw new BadRequestException(
				'El número telefónico ya se encuentra registrado',
			);
	}

	// * Seeders
	async seederList() {
		const usersData = this.userRepository.create([
			// * Admin
			{
				email: 'admin@admin.com',
				name: 'Samuel',
				surname: 'Graterol',
				secondName: 'David',
				secondSurname: 'Lobo',
				password: '11111111',
				birthdate: '2000-12-12',
				genderId: 1,
				phoneNumber: '+584242805116',
				postalCode: '1010',
				residenceAddress: 'Mi casa',
				roleId: 1,
				stateId: 1,
				taxIdentification: '28443870',
				residenceCity: 'Caracas',
			},
		]);

		try {
			const users = await this.userRepository.save(usersData);

			for (const i in users) {
				const user = users[i];
				user.passport = await this.passportService.createOrUpdate(user.id, {
					number: '43434343',
					expirationDate: format(addYears(new Date(), 5), 'yyyy-MM-dd'),
					expeditionDate: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
				});
			}
		} catch (error) {
			this.handleException(error);
		}
	}
}
