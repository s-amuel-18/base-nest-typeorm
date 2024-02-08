import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Gender } from '../entities/gender.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FinderOptions } from 'src/common/interfaces/services.interface';

@Injectable()
export class GenderService {
	private readonly logger = new Logger('GenderService');

	constructor(
		@InjectRepository(Gender)
		private readonly genderRepository: Repository<Gender>,
	) {}

	async findAll() {
		return await this.genderRepository.find();
	}

	async findById(id: number, finderOptions: FinderOptions = {}) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'El genero no se encuentra registrado.',
		} = finderOptions;

		const gender = await this.genderRepository.findOneBy({ id });

		if (gender) return gender;

		if (throwExceptionIfNotFound && !gender)
			throw new NotFoundException(notFoundExceptionMessage);

		return null;
	}

	async seederList() {
		try {
			const genders = [
				{ name: 'Masculíno', code: 'M' },
				{ name: 'Femeníno', code: 'F' },
			];
			await this.genderRepository.save(genders);
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException();
		}
	}
}
