import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatasourceService {
  constructor(private dataSource: DataSource) {}

  async startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
