// chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  // path: '/socket.io' ❌ YEH LINE REMOVE KARO
  cors: {
    origin: [
      'http://localhost:5173',
      'https://chat-app-khaki-delta-97.vercel.app',
    ],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('✅ WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { user: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('📨 Message received:', data);

    this.server.emit('receiveMessage', {
      user: data.user,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    return data;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { user: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('userTyping', data);
  }
}
