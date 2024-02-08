import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  private readonly logger = new Logger('RoleService');

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    return this.roleRepository.find();
  }

  async seederList() {
    try {
      const roles = [
        { code: 'admin', name: 'Administrador' },
        { code: 'colaborator', name: 'Colaborador' },
        { code: 'client', name: 'Cliente' },
      ];
      await this.roleRepository.save(roles);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
