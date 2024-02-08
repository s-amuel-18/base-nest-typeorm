import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterPaymentsTableAddDescriptionColumn1706709214396
  implements MigrationInterface
{
  private readonly tablename = 'payments';
  private readonly newColumnName = 'description';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(this.tablename, [
      new TableColumn({
        name: this.newColumnName,
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'details',
        type: 'text',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tablename, this.newColumnName);
    await queryRunner.dropColumn(this.tablename, 'details');
  }
}
