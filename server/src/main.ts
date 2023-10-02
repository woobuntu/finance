import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LogErrorFilter } from './log/log-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configSerivce = app.get(ConfigService);

  app.enableCors({
    origin: configSerivce.get('client.host'),
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalFilters(
    new LogErrorFilter(
      app.get(HttpAdapterHost),
      app.get(WINSTON_MODULE_NEST_PROVIDER),
    ),
  );

  await app.listen(4000);
}
bootstrap();
