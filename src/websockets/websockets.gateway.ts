import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebsocketsService } from './websockets.service';
import { BadRequestException, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
@WebSocketGateway({ cors: true })
export class WebsocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  logger = new Logger('WebsocketsGateway');
  constructor(
    private readonly websocketsService: WebsocketsService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const { headers } = client.handshake;
    const { token } = headers;

    try {
      if (typeof token != 'string') throw new Error('Error en la conección.');

      const { userId } = await this.authService.decryptToken(token);

      this.websocketsService.connection(client, userId);
    } catch (error) {
      this.logger.error(error);
      client.disconnect(error.message);
    }
  }

  // @SubscribeMessage('disconnect')
  handleDisconnect(client: Socket) {
    this.websocketsService.disconnection(client.id, client);
  }
}
