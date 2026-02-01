import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://chat-app-khaki-delta-97.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  const port = process.env.PORT || 3000;
  
  // IMPORTANT: '0.0.0.0' add karo (Render ke liye zaroori hai)
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📡 WebSocket available at ws://localhost:${port}/socket.io`);
}
bootstrap();