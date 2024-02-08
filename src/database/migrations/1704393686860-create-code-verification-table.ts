import { add } from 'date-fns';
import { CodeVerificationHelper } from 'src/code-verification/code-verification.helper';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCodeVerificationTable1704393686860
  implements MigrationInterface
{
  private readonly tablename = 'codes-verification';
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
            name: 'code',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'is_verified',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'expire_at',
            type: 'timestamp',
            isNullable: false,
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
