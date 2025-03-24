import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { JSDOM } from 'jsdom'
import * as matchers from '@testing-library/jest-dom/matchers'

// 初始化JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
})

// 设置全局变量
Object.defineProperty(global, 'window', {
  value: dom.window,
})
Object.defineProperty(global, 'document', {
  value: dom.window.document,
})
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
})

// 设置DOM相关的类
global.Node = dom.window.Node
global.HTMLElement = dom.window.HTMLElement
global.HTMLDivElement = dom.window.HTMLDivElement
global.Element = dom.window.Element

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// 扩展expect以支持DOM匹配器
expect.extend(matchers)

// 每次测试后清理

// 创建基础的DOM环境
class StorageShim {
  store: { [key: string]: string } = {}
  getItem(key: string) {
    return this.store[key]
  }
  setItem(key: string, value: string) {
    this.store[key] = value
  }
  removeItem(key: string) {
    delete this.store[key]
  }
  clear() {
    this.store = {}
  }
}

Object.defineProperty(window, 'localStorage', { value: new StorageShim() })
Object.defineProperty(window, 'sessionStorage', { value: new StorageShim() })

// 确保document.body存在
document.body.innerHTML = '<div id="root"></div>'

// 扩展Vitest的expect
expect.extend(matchers)

// 每个测试后清理
afterEach(() => {
  cleanup()
})

// 处理window.matchMedia的mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

window.ResizeObserver = mockResizeObserver as unknown as typeof ResizeObserver

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 0)
}) as unknown as typeof requestAnimationFrame

// Mock cancelAnimationFrame
global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id)
}) as unknown as typeof cancelAnimationFrame

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Mock document methods that might be used in React components
document.createRange = vi.fn(() => ({
  setStart: vi.fn(),
  setEnd: vi.fn(),
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
  getBoundingClientRect: vi.fn(),
})) as unknown as typeof document.createRange
