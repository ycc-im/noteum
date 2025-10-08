/**
 * Jest global test setup
 * Configures test environment, mocks, and global utilities
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

Object.defineProperty(global, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
});

// Set up basic IndexedDB mocks
Object.defineProperty(globalThis, 'indexedDB', {
  value: {
    open: jest.fn(),
    deleteDatabase: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(globalThis, 'IDBKeyRange', {
  value: {
    bound: jest.fn(),
    lowerBound: jest.fn(),
    upperBound: jest.fn(),
    only: jest.fn(),
  },
  writable: true,
});

// Global test utilities
(global as any).testUtils = {
  /**
   * Wait for a specified number of milliseconds
   */
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Wait for a condition to become true
   */
  waitFor: async (
    condition: () => boolean | Promise<boolean>,
    timeout = 5000,
    interval = 100
  ): Promise<void> => {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Condition not met within ${timeout}ms`);
  },

  /**
   * Create a mock note for testing
   */
  createMockNote: (overrides: Partial<any> = {}) => ({
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Test Note',
    content: 'Test content #test',
    created_at: new Date(),
    updated_at: new Date(),
    view_positions: {
      daily: { x: 100, y: 200 },
      tags: { x: 300, y: 400 },
    },
    ...overrides,
  }),

  /**
   * Clean up all mocks
   */
  clearAllMocks: () => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.clear.mockClear();
  },
};

// Note: Test lifecycle hooks (beforeEach, afterEach, afterAll) are available globally in Jest
