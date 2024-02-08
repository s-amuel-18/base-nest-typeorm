import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';

// * Entities
import { Country } from '../entities/country.entity';

// * Interfaces
import { FinderOptions } from 'src/common/interfaces/services.interface';
import { State } from '../entities/state.entity';

export class CountryService {
	private readonly logger = new Logger('CountryService');

	constructor(
		@InjectRepository(Country)
		private readonly countryRepository: Repository<Country>,
		@InjectRepository(State)
		private readonly stateRepository: Repository<State>,
	) {}

	async findAll() {
		return await this.countryRepository.find();
	}

	async findById(id: number, finderOptions: FinderOptions = {}) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'El país no se encuentra registrado.',
			withRelations = true,
		} = finderOptions;

		const countries = await this.countryRepository.findOne({
			where: { id },
			...(withRelations
				? {
						relations: {
							states: true,
						},
				  }
				: {}),
		});

		if (countries) return countries;
		if (throwExceptionIfNotFound && !countries)
			throw new NotFoundException(notFoundExceptionMessage);
		return null;
	}

	async seederList() {
		const countriesWithStates = [
			{
				code: 'VE',
				name: 'Venezuela',
				states: [
					{
						code: 'VE-Z',
						name: 'Amazonas',
					},
					{
						code: 'VE-B',
						name: 'Anzoátegui',
					},
				],
			},
			{
				code: 'AR',
				name: 'Argentina',
				states: [
					{
						code: 'AR-B',
						name: 'Buenos Aires',
					},
					{
						code: 'AR-K',
						name: 'Catamarca',
					},
				],
			},
		];

		try {
			for (const i in countriesWithStates) {
				const country = this.countryRepository.create(countriesWithStates[i]);
				const createdCountry = await this.countryRepository.save(country);
				const states = countriesWithStates[i].states.map((state) => ({
					...state,
					countryId: createdCountry.id,
				}));

				await this.stateRepository.save(states);
			}
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException();
		}
	}
}
