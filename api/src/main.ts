import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { adminSwaggerConfig, swaggerConfig } from './configs/swagger.config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const adminDoc = SwaggerModule.createDocument(app, adminSwaggerConfig);
  SwaggerModule.setup('docs', app, document); // The documentation will be available at http://localhost:3000/docs
  SwaggerModule.setup('admin-docs', app, adminDoc); // The admin documentation will be available at http://localhost:3000/admin-docs
    // This line enables validation for all routes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips non-decorated properties
    forbidNonWhitelisted: true, // Throws error if extra properties are sent
    transform: true, // Automatically transforms payloads to DTO instances
    stopAtFirstError: true, // Stops validation on the first error encountered
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
