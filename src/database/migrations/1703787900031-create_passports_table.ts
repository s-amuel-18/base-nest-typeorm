import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePassportsTable1703787900031 implements MigrationInterface {
  private readonly tablename = 'passports';
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
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'varchar',
            length: '50',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'expiration_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'expedition_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'created_at',
            default: 'CURRENT_TIMESTAMP',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tablename);
  }
}
