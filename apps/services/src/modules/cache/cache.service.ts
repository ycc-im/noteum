import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class CacheService {
  private readonly redis: Redis

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      db: 0, // Default database
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.redis.set(key, value)
    if (ttl) {
      await this.redis.expire(key, ttl)
    }
  }

  async setex(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.setex(key, ttl, value)
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key)
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key)
    return result === 1
  }

  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key)
  }

  async incr(key: string): Promise<number> {
    return await this.redis.incr(key)
  }

  async incrby(key: string, increment: number): Promise<number> {
    return await this.redis.incrby(key, increment)
  }

  async hget(hash: string, field: string): Promise<string | null> {
    return await this.redis.hget(hash, field)
  }

  async hset(hash: string, field: string, value: string): Promise<number> {
    return await this.redis.hset(hash, field, value)
  }

  async hdel(hash: string, field: string): Promise<number> {
    return await this.redis.hdel(hash, field)
  }

  async hgetall(hash: string): Promise<Record<string, string>> {
    return await this.redis.hgetall(hash)
  }

  async flushdb(): Promise<string> {
    return await this.redis.flushdb()
  }

  async quit(): Promise<void> {
    await this.redis.quit()
  }
}
