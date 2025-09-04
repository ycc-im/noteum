import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';
import 'dotenv/config';

async function bootstrap() {
  // Create HTTP application
  const app = await NestFactory.create(AppModule);
  
  // Get configuration service
  const configService = app.get(ConfigService);
  
  // Setup validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Get ports from configuration
  const httpPort = configService.get<number>('app.port', 3001);
  const grpcHost = configService.get<string>('app.grpc.host', '0.0.0.0');
  const grpcPort = configService.get<number>('app.grpc.port', 50051);

  // Create the gRPC microservice
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['user', 'note'],
        protoPath: [
          join(__dirname, '../proto/user.proto'),
          join(__dirname, '../proto/note.proto')
        ],
        url: `${grpcHost}:${grpcPort}`,
      },
    },
  );

  // Enable global exception filter for gRPC
  grpcApp.useGlobalFilters(new GrpcExceptionFilter());

  // Start both services
  await grpcApp.listen();
  console.log(`🚀 gRPC Server running on ${grpcHost}:${grpcPort}`);

  await app.listen(httpPort);
  console.log(`🚀 HTTP Server running on http://localhost:${httpPort}`);
  console.log(`🏥 Health check available at http://localhost:${httpPort}/health`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});