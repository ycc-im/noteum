import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  
  // Get configuration
  const port = configService.get<number>('HTTP_PORT') || 3001;
  const host = configService.get<string>('HTTP_HOST') || '0.0.0.0';

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Start HTTP server
  await app.listen(port, host);
  console.log(`🚀 tRPC Server running on http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
  console.log(`🏥 Health check available at http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/health`);
  console.log(`📡 tRPC endpoint available at http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/trpc`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});