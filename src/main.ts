import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

const PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('Live Coding API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, documentFactory);

  await app.listen(PORT, () => {
    logger.log(`Application is running on: http://localhost:${PORT}`);
    logger.log(`Documentation is available at: http://localhost:${PORT}/documentation`);
  });
}
bootstrap();
