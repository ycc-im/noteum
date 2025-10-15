import { z } from 'zod'
import { UlidUtil } from '../utils/ulid.util'

/**
 * ULID 基础验证模式
 */
export const ULIDSchema = z
  .string()
  .min(26, 'ULID must be exactly 26 characters')
  .max(26, 'ULID must be exactly 26 characters')
  .regex(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i, 'Invalid ULID format')
  .transform(value => value.toUpperCase())
  .refine(value => UlidUtil.isValid(value), {
    message: 'Invalid ULID',
  })

/**
 * 可选 ULID 验证模式
 */
export const OptionalULIDSchema = ULIDSchema.optional().nullable()

/**
 * ULID 数组验证模式
 */
export const ULIDArraySchema = z
  .array(ULIDSchema)
  .min(1, 'ULID array cannot be empty')

/**
 * 可选 ULID 数组验证模式
 */
export const OptionalULIDArraySchema = ULIDArraySchema.optional().nullable()

/**
 * 带有元数据的 ULID 验证模式
 */
export const MetadataULIDSchema = z.object({
  id: ULIDSchema,
  metadata: z.record(z.unknown()).optional(),
})

/**
 * 时间范围 ULID 验证模式
 * 包含时间验证的 ULID
 */
export const TimestampedULIDSchema = ULIDSchema.refine(
  value => {
    const timestamp = UlidUtil.decodeTime(value)
    const now = Date.now()
    // 检查时间戳是否在合理范围内（不能是未来时间，不能太久远）
    return timestamp <= now && timestamp >= now - 10 * 365 * 24 * 60 * 60 * 1000 // 10年前
  },
  {
    message: 'ULID timestamp is out of reasonable range',
  }
)

/**
 * 分页 ULID 模式
 * 用于分页查询的 ULID 验证
 */
export const PaginationULIDSchema = ULIDSchema.optional().describe(
  'Optional ULID for pagination cursor'
)

/**
 * Zod ULID 验证工厂
 * 创建自定义 ULID 验证规则
 */
export function createUlidSchema(options?: {
  required?: boolean
  array?: boolean
  optional?: boolean
  timestamped?: boolean
  metadata?: boolean
}) {
  let schema: z.ZodType = ULIDSchema

  if (options?.optional || !options?.required) {
    schema = schema.optional().nullable()
  }

  if (options?.array) {
    schema = z.array(ULIDSchema).optional().nullable()
  }

  if (options?.timestamped) {
    schema = ULIDSchema.refine(
      value => {
        if (!value) return true // 可选字段允许空值
        const timestamp = UlidUtil.decodeTime(value)
        const now = Date.now()
        return (
          timestamp <= now && timestamp >= now - 10 * 365 * 24 * 60 * 60 * 1000
        )
      },
      {
        message: 'ULID timestamp is out of reasonable range',
      }
    )
    if (options.optional) {
      schema = schema.optional().nullable()
    }
  }

  if (options?.metadata) {
    schema = z.object({
      id: ULIDSchema,
      metadata: z.record(z.unknown()).optional(),
    })
  }

  return schema
}

/**
 * 常用 ULID 验证预设
 */
export const ULID_PRESETS = {
  // 基础 ULID
  basic: ULIDSchema,

  // 可选 ULID
  optional: OptionalULIDSchema,

  // 数组 ULID
  array: ULIDArraySchema,

  // 时间戳验证 ULID
  timestamped: TimestampedULIDSchema,

  // 分页 ULID
  pagination: PaginationULIDSchema,

  // 元数据 ULID
  metadata: MetadataULIDSchema,
} as const

// 导出类型
export type ULIDType = z.infer<typeof ULIDSchema>
export type OptionalULIDType = z.infer<typeof OptionalULIDSchema>
export type ULIDArrayType = z.infer<typeof ULIDArraySchema>
export type TimestampedULIDType = z.infer<typeof TimestampedULIDSchema>
export type MetadataULIDType = z.infer<typeof MetadataULIDSchema>
export type PaginationULIDType = z.infer<typeof PaginationULIDSchema>
