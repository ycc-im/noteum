import { Injectable } from '@nestjs/common'

@Injectable()
export class DatabaseService {
  constructor() {
    // 临时实现，稍后会被 Prisma 服务替换
  }

  async query(sql: string, params?: any[]): Promise<any> {
    // 临时实现，返回模拟数据
    console.log('Executing query:', sql, params)
    return { rows: [], rowCount: 0 }
  }

  async healthCheck(): Promise<boolean> {
    // 临时实现，稍后会替换为真实的数据库健康检查
    return true
  }
}
