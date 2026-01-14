import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pega a variável do sistema
  const allowedOrigins = process.env.CORS_ORIGINS;

  app.enableCors({
    // Se a variável existir, transforma em lista. Se não, libera tudo (*).
    origin: allowedOrigins ? allowedOrigins.split(',') : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();