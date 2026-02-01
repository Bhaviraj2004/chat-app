import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Socket.IO adapter set karo
  app.useWebSocketAdapter(new IoAdapter(app));

  // CORS enable karo
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://chat-app-khaki-delta-97.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
