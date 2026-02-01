// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://chat-app-khaki-delta-97.vercel.app',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Server running on ${port}`);
}
bootstrap();
