import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CacheService } from './cache.service'

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {
  static register(redisUrl: string) {
    return {
      module: CacheModule,
      providers: [
        {
          provide: CacheService,
          useFactory: (configService: ConfigService) => {
            return new CacheService(configService)
          },
        },
      ],
      exports: [CacheService],
    }
  }
}