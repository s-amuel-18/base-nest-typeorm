import { connectionSource } from 'src/config/typeorm';
import { getConnection } from 'typeorm';

export class TypeOrmHelper {
  static async runMigrations() {
    // await connection.runMigrations();
  }
}
