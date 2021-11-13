import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { environment } from './environments/environment.prod';

async function bootstrap() {
  const port = process.env.PORT || 3333;
  const mode = environment.production ? 'production' : 'dev';
  const url = `http://localhost:${port}`;
  const apiPath = 'api-docs';
  const apiDocUrl = `${url}/${apiPath}`;

  // app 설정
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  // swagger
  const config = new DocumentBuilder().setTitle('HIED').setDescription('하이드 API 문서').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiPath, app, document);

  // server init
  await app.listen(process.env.PORT || 3333);
  Logger.log(`Run server mode: ${mode}, Listening at ${url}/api, API doc is ${apiDocUrl}`);
}

bootstrap();
