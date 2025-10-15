import type {
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator'
import { registerDecorator, ValidatorConstraint } from 'class-validator'
import { UlidUtil } from '../utils/ulid.util'

/**
 * ULID 验证约束类
 */
@ValidatorConstraint({ name: 'ulid', async: false })
export class ULIDConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    if (typeof value !== 'string') {
      return false
    }
    return UlidUtil.isValid(value)
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid ULID (26-character Crockford Base32 string)`
  }
}

/**
 * ULID 验证装饰器
 * @param validationOptions 验证选项
 */
export function IsUlid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ULIDConstraint,
    })
  }
}

/**
 * ULID 数组验证装饰器
 * @param validationOptions 验证选项
 */
export function IsUlidArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUlidArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          if (!Array.isArray(value)) {
            return false
          }
          return value.every(
            item => typeof item === 'string' && UlidUtil.isValid(item)
          )
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of valid ULIDs`
        },
      },
    })
  }
}

/**
 * 可选 ULID 验证装饰器
 * @param validationOptions 验证选项
 */
export function IsOptionalUlid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOptionalUlid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          if (value === null || value === undefined || value === '') {
            return true
          }
          return typeof value === 'string' && UlidUtil.isValid(value)
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ULID or empty`
        },
      },
    })
  }
}
