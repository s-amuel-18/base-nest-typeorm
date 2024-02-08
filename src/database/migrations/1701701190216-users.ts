import { Table, MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

export class UserMigration1701701190216 implements MigrationInterface {
  private readonly tablename = 'users';

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
            name: 'role_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'gender_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'state_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'timezone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tax_identification',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'second_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'surname',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'second_surname',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '30',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'second_phone_number',
            type: 'varchar',
            length: '30',
            isNullable: true,
          },

          {
            name: 'birthdate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'residence_address',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'residence_city',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'postal_code',
            type: 'varchar',
            length: '10',
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
