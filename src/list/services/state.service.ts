import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { State } from '../entities/state.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FinderOptions } from '../../common/interfaces/services.interface';
import { CountryService } from './country.service';

@Injectable()
export class StateService {
	constructor(
		@InjectRepository(State)
		private readonly stateRepository: Repository<State>,

		private readonly countryService: CountryService,
	) {}

	async findByCountryId(id: number) {
		await this.countryService.findById(id, { throwExceptionIfNotFound: true });

		return await this.stateRepository.find({ where: { countryId: id } });
	}

	async findById(id: number, finderOptions: FinderOptions = {}) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'El estado no se encuentra registrado.',
			withRelations = true,
		} = finderOptions;

		const state = await this.stateRepository.findOne({
			where: { id },
			...(withRelations
				? {
						relations: {
							country: true,
						},
				  }
				: {}),
		});

		if (state) return state;

		if (throwExceptionIfNotFound && !state)
			throw new NotFoundException(notFoundExceptionMessage);

		return null;
	}
}
