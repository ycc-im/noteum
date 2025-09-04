import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';

async function bootstrap() {
  // Create the gRPC microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['user', 'note'],
        protoPath: [
          join(__dirname, '../proto/user.proto'),
          join(__dirname, '../proto/note.proto')
        ],
        url: '0.0.0.0:50051',
      },
    },
  );

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Enable global exception filter
  app.useGlobalFilters(new GrpcExceptionFilter());

  // Start the microservice
  await app.listen();
  console.log('gRPC server is running on port 50051');
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});