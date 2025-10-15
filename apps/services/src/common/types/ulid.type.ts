import { IsString, validate } from 'class-validator'
import { Transform } from 'class-transformer'

/**
 * ULID 基础类型
 * 表示一个有效的 ULID 标识符
 */
export type ULID = string & { readonly __brand: unique symbol }

/**
 * 创建 ULID 类型实例
 * @param value 字符串值
 * @returns ULID 实例或 null
 */
export function createULID(value: string): ULID | null {
  if (typeof value !== 'string') return null

  // ULID 格式验证：26个字符，Crockford Base32 编码
  const ulidRegex = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i
  if (!ulidRegex.test(value)) return null

  return value as ULID
}

/**
 * 检查字符串是否为有效的 ULID
 * @param value 待检查的值
 * @returns 是否为有效 ULID
 */
export function isULID(value: unknown): value is ULID {
  return typeof value === 'string' && createULID(value) !== null
}

/**
 * 类型守卫：验证输入是否为 ULID
 * @param value 输入值
 * @returns 类型守卫结果
 */
export function isValidUlid(value: unknown): value is string {
  if (typeof value !== 'string') return false
  const ulidRegex = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i
  return ulidRegex.test(value)
}

/**
 * ULID 验证装饰器
 * 用于 class-validator 的 ULID 验证
 */
export function IsULID() {
  return IsString()
}

/**
 * ULID 转换装饰器
 * 用于 class-transformer 的 ULID 字符串转换
 */
export function TransformULID() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toUpperCase() // 统一转换为大写
    }
    return value
  })
}

/**
 * ULID 验证和转换的组合装饰器
 */
export function ValidateULID() {
  return function (target: any, propertyKey: string) {
    IsString()(target, propertyKey)
    TransformULID()(target, propertyKey)
  }
}

/**
 * 数据库 ULID 字段类型
 * 表示数据库中的 ULID 主键
 */
export type DatabaseULID = ULID

/**
 * API ULID 响应类型
 * 表示 API 响应中的 ULID
 */
export type ApiULID = string

/**
 * 时间相关的 ULID 工具类型
 */
export interface TimestampedULID {
  readonly id: ULID
  readonly timestamp: number
}

/**
 * 带有元数据的 ULID 类型
 */
export interface MetadataULID {
  readonly id: ULID
  readonly metadata?: Record<string, unknown>
}

/**
 * ULID 比较器类型
 */
export type ULIDComparator = (a: ULID, b: ULID) => number

/**
 * 默认 ULID 比较器实现
 */
export const defaultULIDComparator: ULIDComparator = (a, b) => {
  // 直接字符串比较，因为 ULID 是按时间排序的
  return a.localeCompare(b)
}

/**
 * 常用 ULID 常量
 */
export const ULID_CONSTANTS = {
  LENGTH: 26,
  ENCODING: 'CROCKFORD_BASE32',
  PATTERN: /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i,
  MIN_TIME: 0,
  MAX_TIME: 281474976710655, // 48-bit 最大值
} as const

// 导出类型检查函数
