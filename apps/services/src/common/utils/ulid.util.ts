import { ulid, decodeTime } from 'ulid'

/**
 * ULID 工具类
 * 提供统一的可排序唯一标识符生成和验证功能
 */
export class UlidUtil {
  /**
   * 生成新的 ULID
   * @returns 新的 ULID 字符串
   */
  static generate(): string {
    return ulid()
  }

  /**
   * 从 ULID 解码时间戳
   * @param ulidString ULID 字符串
   * @returns 时间戳（毫秒）
   */
  static decodeTime(ulidString: string): number {
    // 使用 ulid 库的 decodeTime 函数
    return decodeTime(ulidString)
  }

  /**
   * 生成指定时间的 ULID
   * @param timestamp 时间戳（毫秒）
   * @returns 指定时间的 ULID 字符串
   */
  static fromTime(timestamp: number): string {
    return ulid(timestamp)
  }

  /**
   * 验证 ULID 格式
   * @param ulidString 待验证的字符串
   * @returns 是否为有效的 ULID
   */
  static isValid(ulidString: string): boolean {
    // ULID 格式：26个字符，由 Crockford Base32 编码
    const ulidRegex = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i
    return ulidRegex.test(ulidString)
  }

  /**
   * 生成 ULID 的二进制表示
   * @param ulidString ULID 字符串
   * @returns Buffer
   */
  static toBinary(ulidString: string): Buffer {
    if (!this.isValid(ulidString)) {
      throw new Error('Invalid ULID format')
    }
    return Buffer.from(ulidString, 'ascii')
  }

  /**
   * 从二进制数据创建 ULID
   * @param buffer 二进制数据
   * @returns ULID 字符串
   */
  static fromBinary(buffer: Buffer): string {
    return buffer.toString('ascii')
  }

  /**
   * 获取 ULID 的单调递增序列
   * @param lastUlid 上一个 ULID
   * @returns 新的 ULID
   */
  static monotonic(lastUlid?: string): string {
    // 使用 ulid 库的 monotonic 函数
    return ulid(Date.now())
  }

  /**
   * 获取 ULID 的创建时间
   * @param ulidString ULID 字符串
   * @returns Date 对象
   */
  static createdAt(ulidString: string): Date {
    const timestamp = this.decodeTime(ulidString)
    return new Date(timestamp)
  }

  /**
   * 比较两个 ULID 的时间顺序
   * @param ulid1 第一个 ULID
   * @param ulid2 第二个 ULID
   * @returns 负数表示 ulid1 < ulid2，0 表示相等，正数表示 ulid1 > ulid2
   */
  static compare(ulid1: string, ulid2: string): number {
    const time1 = this.decodeTime(ulid1)
    const time2 = this.decodeTime(ulid2)
    return time1 - time2
  }

  /**
   * 检查 ULID 是否在指定时间范围内
   * @param ulidString ULID 字符串
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @returns 是否在时间范围内
   */
  static isWithinTimeRange(
    ulidString: string,
    startTime: Date,
    endTime: Date
  ): boolean {
    const createdTime = this.createdAt(ulidString)
    return createdTime >= startTime && createdTime <= endTime
  }

  /**
   * 生成测试用的 ULID
   * @param seed 测试种子
   * @returns 测试 ULID
   */
  static generateTestUlid(seed: number = 0): string {
    const testTime = Date.now() - 86400000 * seed // 每个种子回退一天
    return this.fromTime(testTime)
  }
}

export default UlidUtil
