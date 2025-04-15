import { describe, expect, test } from 'bun:test'
import { add, capitalize } from '../src/utils'

describe('Utils', () => {
  test('add function adds two numbers correctly', () => {
    expect(add(1, 2)).toBe(3)
    expect(add(-1, 1)).toBe(0)
    expect(add(0, 0)).toBe(0)
  })

  test('capitalize function formats strings correctly', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('')).toBe('')
    expect(capitalize('a')).toBe('A')
  })
})
