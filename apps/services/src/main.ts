import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { WinstonModule } from 'nest-winston'
import { loggerConfig } from './common/logger/logger.config'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  })

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter())

  // 全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor())

  // CORS 配置
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })

  // API 前缀
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1')

  // Swagger 文档
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Noteum Services API')
      .setDescription('Noteum 协作平台后端服务 API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
  }

  const port = process.env.PORT || 3000
  await app.listen(port)

  console.log(`🚀 Application is running on: http://localhost:${port}`)
  console.log(`📚 Swagger docs available at: http://localhost:${port}/docs`)
}

bootstrap()
