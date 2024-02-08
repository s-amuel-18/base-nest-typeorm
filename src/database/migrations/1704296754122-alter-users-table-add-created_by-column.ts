import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterUsersTableAddCreatedByColumn1704296754122
  implements MigrationInterface
{
  private readonly tablename = 'users';
  private readonly newColumnName = 'created_by';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tablename,
      new TableColumn({
        name: this.newColumnName,
        type: 'int',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tablename, this.newColumnName);
  }
}
