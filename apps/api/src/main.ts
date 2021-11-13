import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // const config = new DocumentBuilder()
  //   .setTitle('Cats example')
  //   .setDescription('The cats API description')
  //   .setVersion('1.0')
  //   .addTag('cats')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api-doc', app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}/${globalPrefix}`);
  });
}

bootstrap();
