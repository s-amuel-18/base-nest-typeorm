import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { CodeVerification } from './entities/code-verification.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCodeVerification } from './interfaces/create-code-verification.interface';
import { CodeVerificationHelper } from './code-verification.helper';
import { add } from 'date-fns';
import { FinderOptions } from '../common/interfaces/services.interface';

@Injectable()
export class CodeVerificationService {
	private readonly logger = new Logger('CodeVerificationService');
	constructor(
		@InjectRepository(CodeVerification)
		private readonly codeVerificationRepository: Repository<CodeVerification>,
	) {}

	async create(userId: number) {
		try {
			const code = await this.generateCode();
			const codeVer = this.codeVerificationRepository.create({
				code,
				expireAt: add(new Date(), { minutes: 30 }),
				userId,
			});

			const codeCreated = await this.codeVerificationRepository.save(codeVer);

			return codeCreated;
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException();
		}
	}

	async generateCode(): Promise<string> {
		let code = CodeVerificationHelper.generateRandomCode();
		let codeExist = await this.findByCode(code);

		while (!!codeExist) {
			code = CodeVerificationHelper.generateRandomCode();
			codeExist = await this.findByCode(code);
		}

		return code;
	}

	async findByCode(code: string) {
		try {
			const codeVerification = await this.codeVerificationRepository.findOne({
				where: { code },
			});
			return codeVerification;
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException();
		}
	}

	async findById(codeId: number) {
		const code = this.codeVerificationRepository.findOne({
			where: { id: codeId },
			relations: { user: true },
		});

		if (code) return code;
		return null;
	}

	async findValidCodeByCode(code: string, finderOptions: FinderOptions = {}) {
		const {
			throwExceptionIfNotFound = true,
			notFoundExceptionMessage = 'El codigo no es invalido',
		} = finderOptions;

		const codeVerification = await this.codeVerificationRepository.findOne({
			where: {
				code,
				isVerified: false,
				expireAt: MoreThan(new Date()),
			},
			relations: {
				user: true,
			},
		});

		if (codeVerification) {
			if (!codeVerification.user)
				throw new BadRequestException(notFoundExceptionMessage);

			return codeVerification;
		}

		if (throwExceptionIfNotFound && !codeVerification)
			throw new BadRequestException(notFoundExceptionMessage);

		return null;
	}

	async isCodeValid(code: string) {
		try {
			const codeVerification = await this.findValidCodeByCode(code, {
				throwExceptionIfNotFound: false,
			});
			return !!codeVerification;
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException();
		}
	}

	async verify(code: CodeVerification) {
		const verifiedCode = this.codeVerificationRepository.merge(code, {
			isVerified: true,
		});
		await this.codeVerificationRepository.save(verifiedCode);
	}

	async destroy(codeId: number) {
		try {
			await this.codeVerificationRepository.delete({ id: codeId });
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException();
		}
	}
}
