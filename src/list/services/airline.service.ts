import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Airline } from '../entities/airline.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AirlineService {
  private readonly logger = new Logger('AirlineService');

  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
  ) {}

  // * Finders
  async findAll() {
    const airlines = await this.airlineRepository.find();
    return airlines;
  }

  // * Seeders
  async seederList() {
    try {
      const airlinesData = [
        { name: 'LASER Airlines', code: 'QL' },
        { name: 'RED Air', code: 'L5' },
      ];

      await this.airlineRepository.save(airlinesData);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
