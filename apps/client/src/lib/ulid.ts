import { ulid } from 'ulid'

/**
 * 生成新的 ULID
 * @returns 新的 ULID 字符串
 */
export function generateUlid(): string {
  return ulid()
}

/**
 * 验证 ULID 格式
 * @param ulidString 待验证的字符串
 * @returns 是否为有效的 ULID
 */
export function validateUlid(ulidString: string): boolean {
  const ulidRegex = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i
  return ulidRegex.test(ulidString)
}

/**
 * 从 ULID 解码时间戳
 * @param ulidString ULID 字符串
 * @returns 时间戳（毫秒）
 */
export function decodeUlidTime(ulidString: string): number {
  // 使用 ulid 库的 decodeTime 函数
  const { decodeTime } = require('ulid')
  return decodeTime(ulidString)
}

/**
 * 获取 ULID 的创建时间
 * @param ulidString ULID 字符串
 * @returns Date 对象
 */
export function getUlidCreatedAt(ulidString: string): Date {
  const timestamp = decodeUlidTime(ulidString)
  return new Date(timestamp)
}

/**
 * 生成指定时间的 ULID
 * @param timestamp 时间戳（毫秒）
 * @returns 指定时间的 ULID 字符串
 */
export function generateUlidFromTime(timestamp: number): string {
  const { ulid: ulidFromTime } = require('ulid')
  return ulidFromTime(timestamp)
}

/**
 * 比较两个 ULID 的时间顺序
 * @param ulid1 第一个 ULID
 * @param ulid2 第二个 ULID
 * @returns 负数表示 ulid1 < ulid2，0 表示相等，正数表示 ulid1 > ulid2
 */
export function compareUlid(ulid1: string, ulid2: string): number {
  const time1 = decodeUlidTime(ulid1)
  const time2 = decodeUlidTime(ulid2)
  return time1 - time2
}
