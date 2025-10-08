/**
 * Test setup for Vitest
 * Configure fake IndexedDB for testing
 */

import FDBFactory from 'fake-indexeddb/FDBFactory';
import FDBKeyRange from 'fake-indexeddb/FDBKeyRange';

// Set up fake IndexedDB globals
Object.defineProperty(globalThis, 'indexedDB', {
  value: new FDBFactory(),
  writable: true,
});

Object.defineProperty(globalThis, 'IDBKeyRange', {
  value: FDBKeyRange,
  writable: true,
});

// Also set on global for compatibility
if (typeof global !== 'undefined') {
  global.indexedDB = new FDBFactory();
  global.IDBKeyRange = FDBKeyRange;
}

// Also set on window for browser-like environment
if (typeof window !== 'undefined') {
  window.indexedDB = new FDBFactory();
  window.IDBKeyRange = FDBKeyRange;
}
