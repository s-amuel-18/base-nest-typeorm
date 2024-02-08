import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmHelper } from './common/helpers/typeorm.helper';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    setTimeout(async () => {
      await TypeOrmHelper.runMigrations();
    }, 3000);
  }
}
