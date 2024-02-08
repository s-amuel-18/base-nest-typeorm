import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFlightTypesTable1703788194281 implements MigrationInterface {
  private readonly tablename = 'flight-types';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tablename,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tablename);
  }
}
