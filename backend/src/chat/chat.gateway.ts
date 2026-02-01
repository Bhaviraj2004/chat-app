import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/socket.io',
  cors: {
    origin: [
      'http://localhost:5173',
      'https://chat-app-khaki-delta-97.vercel.app',
    ],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // Jab koi user connect hota hai
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Jab koi user disconnect hota hai
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Message receive karne ke liye
  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { user: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Message received:', data);
    
    // Sabhi connected clients ko message bhejein
    this.server.emit('receiveMessage', {
      user: data.user,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
    
    return data;
  }

  // Typing indicator
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { user: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('userTyping', data);
  }
}