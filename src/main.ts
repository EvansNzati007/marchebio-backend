import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const loggerService = new LoggerService();

  const port = configService.get<number>('port') ?? 3000;

  await app.listen(port, '0.0.0.0');

  loggerService.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
