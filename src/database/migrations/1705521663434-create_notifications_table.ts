import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNotificationsTable1705521663434
  implements MigrationInterface
{
  private readonly tablename = 'notifications';
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
            name: 'notification_type_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
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
