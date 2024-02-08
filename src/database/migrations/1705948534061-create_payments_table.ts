import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentsTable1705948534061 implements MigrationInterface {
  private readonly tablename = 'payments';
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
            name: 'amount',
            type: 'float',
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'paid_on',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'reference',
            type: 'varchar',
            length: '100',
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
