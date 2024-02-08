import { Body, Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { RunSeedDto } from './dto/run-seed.dto';
import { ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/run')
  @ApiOperation({ deprecated: true })
  async runSeed(@Body() credentials: RunSeedDto) {
    await this.seederService.runSeeders();
    return {
      message: 'Seeders excecuted',
    };
  }

  @Post('/refresh-db')
  @ApiOperation({ deprecated: true })
  async refreshDb(@Body() credentials: RunSeedDto) {
    await this.seederService.refreshDb();
    return {
      message: 'Db reseted',
    };
  }

  @Post('/run-migrations')
  @ApiOperation({ deprecated: true })
  async runMigrations(@Body() credentials: RunSeedDto) {
    await this.seederService.runMigrations();
    return {
      message: 'Migrations excecuted',
    };
  }
}
