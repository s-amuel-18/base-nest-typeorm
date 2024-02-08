import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	forwardRef,
} from '@nestjs/common';
import { isBefore, parseISO } from 'date-fns';

// * Entities
import { Passport } from '../entities/passport.entity';

// * Interfaces
import { FinderOptions } from '../../common/interfaces/services.interface';
import { PassportDatesInfo } from '../interfaces/passport.interface';

// * DTOs
import { CreatePassportDto } from '../dto/create-passport.dto';

// * Services
import { UserService } from './user.service';

@Injectable()
export class PassportService {
	private readonly logger = new Logger('PassportService');
	constructor(
		@InjectRepository(Passport)
		private readonly passportRepository: Repository<Passport>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	async createOrUpdate(userId: number, createPassportDto: CreatePassportDto) {
		this.throwExceptionIfDatesAreNotValid(createPassportDto);

		await this.userService.findOne(userId, {
			throwExceptionIfNotFound: true,
			withRelations: false,
		});

		const passport = await this.findByUserId(userId, {
			throwExceptionIfNotFound: false,
		});

		try {
			// * Actualizar pasaporte
			if (passport) {
				if (passport.number != createPassportDto.number)
					await this.throwExceptionIfNumberAlreadyExist(
						createPassportDto.number,
					);

				const passportMerged = this.passportRepository.merge(
					passport,
					createPassportDto,
				);

				await this.passportRepository.save(passportMerged);
			} else {
				// * Creación de pasaporte
				const passportCreated = this.passportRepository.create({
					...createPassportDto,
					userId,
				});

				await this.passportRepository.save(passportCreated);
			}

			return await this.findByUserId(userId, {
				throwExceptionIfNotFound: false,
			});
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException();
		}
	}

	async findByNumber(
		passportNumber: string,
		finderOptions: FinderOptions = {},
	) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'El pasaporte no se encuentra registrado.',
		} = finderOptions;

		const passport = await this.passportRepository.findOneBy({
			number: passportNumber,
		});

		if (passport) return passport;
		if (throwExceptionIfNotFound && !passport)
			throw new NotFoundException(notFoundExceptionMessage);
		return null;
	}

	async throwExceptionIfNumberAlreadyExist(passportNumber: string) {
		const passport = await this.findByNumber(passportNumber, {
			throwExceptionIfNotFound: false,
		});

		if (passport)
			throw new BadRequestException(
				`Ya existe un pasaporte con el numero "${passportNumber}"`,
			);
	}

	async findByUserId(userId: number, finderOptions: FinderOptions = {}) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'No se encontró pasaporte',
		} = finderOptions;

		const passport = await this.passportRepository.findOneBy({ userId });
		if (passport) return passport;
		if (throwExceptionIfNotFound && !passport)
			throw new NotFoundException(notFoundExceptionMessage);

		return null;
	}

	isExpeditionBeforeThanExpiration(datesInfo: PassportDatesInfo): Boolean {
		const { expeditionDate, expirationDate } = datesInfo;
		const expeditionDateParse = parseISO(expeditionDate);
		const expirationDateParse = parseISO(expirationDate);

		return isBefore(expeditionDateParse, expirationDateParse);
	}

	throwExceptionIfDatesAreNotValid(datesInfo: PassportDatesInfo) {
		if (!this.isExpeditionBeforeThanExpiration(datesInfo))
			throw new BadRequestException(
				'Las fechas de emisión y expiración del pasaporte no son validas, la fecha de expiración debe ser posterior a la de expedición',
			);
	}
}
