import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// * Entities
import { FlightType } from '../entities/flightType.entity';

@Injectable()
export class FlightTypeService {
  private readonly logger = new Logger('FlightTypeService');

  constructor(
    @InjectRepository(FlightType)
    private readonly flightTypeRepository: Repository<FlightType>,
  ) {}

  async findAll() {
    const flightTypes = await this.flightTypeRepository.find();
    return flightTypes;
  }

  async seederList() {
    try {
      const flightTypes = [
        { name: 'Económica', code: 'Y' },
        { name: 'Ejecutiva', code: 'C' },
      ];
      await this.flightTypeRepository.save(flightTypes);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
