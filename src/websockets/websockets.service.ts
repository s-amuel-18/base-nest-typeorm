import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Notification } from '../notifications/entities/notification.entity';
import { WSEvents } from './interfaces/ws-events.interface';
import { NewReservationPayment } from './interfaces/reservation-payment.interface';

@Injectable()
export class WebsocketsService {
  private sockets: Map<number, Socket[]> = new Map();

  connection(@ConnectedSocket() client: Socket, userId: number) {
    if (!this.sockets.has(userId)) this.sockets.set(userId, []);
    this.sockets.get(userId).push(client);
  }

  disconnection(clientId: string, client: Socket) {
    for (const [userId, clientSockets] of this.sockets) {
      const newClients = clientSockets.filter((cl) => cl.id != clientId);
      if (newClients.length != clientSockets.length)
        this.sockets.set(userId, newClients);
      if (newClients.length === 0) this.sockets.delete(userId);
    }
  }

  triggerEventForUser(userId: number, eventName: WSEvents, payload: any) {
    const userSockets = this.sockets.get(userId);

    if (!userSockets) return;

    for (let socket of userSockets) {
      socket.emit(eventName, payload);
    }
  }

  // * Notifications
  newNotification(userId: number, notification: Notification) {
    this.triggerEventForUser(userId, WSEvents.newNotification, notification);
  }

  // * Payments
  newPayment(userId: number, newReservationPayment: NewReservationPayment) {
    this.triggerEventForUser(
      userId,
      WSEvents.newReservationPayment,
      newReservationPayment,
    );
  }
}
