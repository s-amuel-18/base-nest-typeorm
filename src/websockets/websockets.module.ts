import { Module, forwardRef } from '@nestjs/common';
import { WebsocketsService } from './websockets.service';
import { WebsocketsGateway } from './websockets.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [WebsocketsGateway, WebsocketsService],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}
