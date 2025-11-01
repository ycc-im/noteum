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

  // Redis Stream operations
  async xadd(
    stream: string,
    id: string,
    fields: Record<string, string>
  ): Promise<string> {
    try {
      // 将 fields 对象展开为参数数组
      const flatFields = Object.entries(fields).flat()
      const result = await this.redis.xadd(stream, id, ...flatFields)
      return result || ''
    } catch (error: any) {
      throw new Error(
        `Failed to add entry to stream ${stream}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  async xread(
    stream: string,
    consumerGroup?: string,
    consumerName?: string,
    count?: number
  ): Promise<any[]> {
    try {
      if (consumerGroup && consumerName) {
        // 简化实现，暂时返回空数组
        return []
      } else {
        // 简化实现，使用 xrange 代替 xread
        return await this.xrange(stream, '-', '+', count)
      }
    } catch (error) {
      throw new Error(
        `Failed to read from stream ${stream}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  async xgroupCreate(
    stream: string,
    group: string,
    id: string = '$'
  ): Promise<string> {
    try {
      const result = await this.redis.xgroup(
        'CREATE',
        stream,
        group,
        id,
        'MKSTREAM'
      )
      return String(result)
    } catch (error: any) {
      if (error?.message?.includes('BUSYGROUP')) {
        return 'Group already exists'
      }
      throw new Error(
        `Failed to create consumer group ${group} for stream ${stream}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  async xgroupDestroy(stream: string, group: string): Promise<number> {
    try {
      const result = await this.redis.xgroup('DESTROY', stream, group)
      return Number(result)
    } catch (error) {
      throw new Error(
        `Failed to destroy consumer group ${group} for stream ${stream}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  async xrange(
    stream: string,
    start: string = '-',
    end: string = '+',
    count?: number
  ): Promise<any[]> {
    try {
      if (count) {
        const result = await this.redis.xrange(
          stream,
          start,
          end,
          'COUNT',
          count
        )
        return result
      } else {
        const result = await this.redis.xrange(stream, start, end)
        return result
      }
    } catch (error: any) {
      throw new Error(
        `Failed to read range from stream ${stream}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  async xlen(stream: string): Promise<number> {
    try {
      const result = await this.redis.xlen(stream)
      return Number(result)
    } catch (error) {
      throw new Error(
        `Failed to get length of stream ${stream}: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
}
