/**
 * Storage Event Manager Tests
 *
 * Comprehensive test suite for the StorageEventManager class.
 * Tests event registration, emission, filtering, debouncing, and cleanup.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageEventManager } from './event-manager';
import { StorageEventUtils } from './event-builder';
import type {
  StorageEvent,
  StorageChangeEvent,
  StorageErrorEvent,
} from './events';

describe('StorageEventManager', () => {
  let eventManager: StorageEventManager;
  let mockListener: vi.MockedFunction<any>;
  let mockErrorListener: vi.MockedFunction<any>;

  beforeEach(() => {
    eventManager = new StorageEventManager({
      enableLogging: false,
      maxListeners: 10,
      defaultDebounce: 0,
    });
    mockListener = vi.fn();
    mockErrorListener = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    eventManager.destroy();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Event Registration', () => {
    it('should register event listeners', () => {
      const unsubscribe = eventManager.on('change', mockListener);

      expect(eventManager.listenerCount('change')).toBe(1);
      expect(typeof unsubscribe).toBe('function');
    });

    it('should support multiple listeners for same event', () => {
      const mockListener2 = vi.fn();

      eventManager.on('change', mockListener);
      eventManager.on('change', mockListener2);

      expect(eventManager.listenerCount('change')).toBe(2);
    });

    it('should enforce maximum listener limit', () => {
      // Register up to the limit
      for (let i = 0; i < 10; i++) {
        eventManager.on('change', vi.fn());
      }

      // Should throw when exceeding limit
      expect(() => {
        eventManager.on('change', vi.fn());
      }).toThrow('Maximum number of listeners (10) exceeded');
    });

    it('should register one-time listeners', () => {
      const unsubscribe = eventManager.once('change', mockListener);

      expect(eventManager.listenerCount('change')).toBe(1);
      expect(typeof unsubscribe).toBe('function');
    });

    it('should return event types', () => {
      eventManager.on('change', mockListener);
      eventManager.on('error', mockErrorListener);

      const eventTypes = eventManager.eventNames();
      expect(eventTypes).toContain('change');
      expect(eventTypes).toContain('error');
      expect(eventTypes).toHaveLength(2);
    });
  });

  describe('Event Emission', () => {
    it('should emit events to registered listeners', () => {
      eventManager.on('change', mockListener);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      expect(mockListener).toHaveBeenCalledWith(event);
      expect(mockListener).toHaveBeenCalledTimes(1);
    });

    it('should emit events to multiple listeners', () => {
      const mockListener2 = vi.fn();

      eventManager.on('change', mockListener);
      eventManager.on('change', mockListener2);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      expect(mockListener).toHaveBeenCalledWith(event);
      expect(mockListener2).toHaveBeenCalledWith(event);
    });

    it('should not emit to unregistered event types', () => {
      eventManager.on('change', mockListener);

      const errorEvent = StorageEventUtils.operationError(
        'Test error',
        'test-op',
        'indexeddb'
      );
      eventManager.emit(errorEvent);

      expect(mockListener).not.toHaveBeenCalled();
    });

    it('should handle listener errors gracefully', () => {
      const erroringListener = vi.fn(() => {
        throw new Error('Listener error');
      });

      eventManager.on('change', erroringListener);
      eventManager.on('change', mockListener);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );

      // Should not throw
      expect(() => eventManager.emit(event)).not.toThrow();

      // Other listeners should still execute
      expect(mockListener).toHaveBeenCalledWith(event);
    });
  });

  describe('One-time Listeners', () => {
    it('should remove one-time listeners after execution', () => {
      eventManager.once('change', mockListener);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(eventManager.listenerCount('change')).toBe(0);

      // Second emission should not call listener
      eventManager.emit(event);
      expect(mockListener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple one-time listeners', () => {
      const mockListener2 = vi.fn();

      eventManager.once('change', mockListener);
      eventManager.once('change', mockListener2);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener2).toHaveBeenCalledTimes(1);
      expect(eventManager.listenerCount('change')).toBe(0);
    });
  });

  describe('Event Filtering', () => {
    it('should filter events by source', () => {
      eventManager.on('change', mockListener, { source: 'indexeddb' });

      const indexeddbEvent = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      const localstorageEvent = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'localstorage'
      );

      eventManager.emit(indexeddbEvent);
      eventManager.emit(localstorageEvent);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith(indexeddbEvent);
    });

    it('should filter change events by key pattern string', () => {
      eventManager.on('change', mockListener, { keyPattern: 'user.' });

      const userEvent = StorageEventUtils.dataAdded(
        'user.profile',
        'data',
        'indexeddb'
      );
      const appEvent = StorageEventUtils.dataAdded(
        'app.settings',
        'data',
        'indexeddb'
      );

      eventManager.emit(userEvent);
      eventManager.emit(appEvent);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith(userEvent);
    });

    it('should filter change events by key pattern regex', () => {
      eventManager.on('change', mockListener, { keyPattern: /^user\./ });

      const userEvent = StorageEventUtils.dataAdded(
        'user.profile',
        'data',
        'indexeddb'
      );
      const appEvent = StorageEventUtils.dataAdded(
        'app.settings',
        'data',
        'indexeddb'
      );

      eventManager.emit(userEvent);
      eventManager.emit(appEvent);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith(userEvent);
    });

    it('should combine multiple filters', () => {
      eventManager.on('change', mockListener, {
        source: 'indexeddb',
        keyPattern: 'user.',
      });

      const matchingEvent = StorageEventUtils.dataAdded(
        'user.profile',
        'data',
        'indexeddb'
      );
      const wrongSourceEvent = StorageEventUtils.dataAdded(
        'user.profile',
        'data',
        'localstorage'
      );
      const wrongKeyEvent = StorageEventUtils.dataAdded(
        'app.settings',
        'data',
        'indexeddb'
      );

      eventManager.emit(matchingEvent);
      eventManager.emit(wrongSourceEvent);
      eventManager.emit(wrongKeyEvent);

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith(matchingEvent);
    });
  });

  describe('Debouncing', () => {
    it('should debounce events', () => {
      eventManager.on('change', mockListener, { debounce: 100 });

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );

      // Emit multiple events quickly
      eventManager.emit(event);
      eventManager.emit(event);
      eventManager.emit(event);

      // Should not have been called yet
      expect(mockListener).not.toHaveBeenCalled();

      // Advance time to trigger debounced call
      vi.advanceTimersByTime(100);

      // Should be called only once
      expect(mockListener).toHaveBeenCalledTimes(1);
    });

    it('should reset debounce timer on new events', () => {
      eventManager.on('change', mockListener, { debounce: 100 });

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );

      eventManager.emit(event);
      vi.advanceTimersByTime(50);

      // Emit another event, should reset timer
      eventManager.emit(event);
      vi.advanceTimersByTime(50);

      // Should not have been called yet (total 100ms, but reset halfway)
      expect(mockListener).not.toHaveBeenCalled();

      // Complete the debounce period
      vi.advanceTimersByTime(50);
      expect(mockListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Listener Removal', () => {
    it('should remove specific listeners', () => {
      eventManager.on('change', mockListener);
      eventManager.off('change', mockListener);

      expect(eventManager.listenerCount('change')).toBe(0);
    });

    it('should remove listeners via unsubscribe function', () => {
      const unsubscribe = eventManager.on('change', mockListener);
      unsubscribe();

      expect(eventManager.listenerCount('change')).toBe(0);
    });

    it('should remove all listeners for an event type', () => {
      const mockListener2 = vi.fn();

      eventManager.on('change', mockListener);
      eventManager.on('change', mockListener2);
      eventManager.on('error', mockErrorListener);

      eventManager.removeAllListeners('change');

      expect(eventManager.listenerCount('change')).toBe(0);
      expect(eventManager.listenerCount('error')).toBe(1);
    });

    it('should remove all listeners for all events', () => {
      eventManager.on('change', mockListener);
      eventManager.on('error', mockErrorListener);

      eventManager.removeAllListeners();

      expect(eventManager.listenerCount('change')).toBe(0);
      expect(eventManager.listenerCount('error')).toBe(0);
      expect(eventManager.eventNames()).toHaveLength(0);
    });

    it('should clean up debounce timers when removing listeners', () => {
      const unsubscribe = eventManager.on('change', mockListener, {
        debounce: 100,
      });

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      // Remove listener before debounce completes
      unsubscribe();

      // Advance time - listener should not be called
      vi.advanceTimersByTime(100);
      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('Event History', () => {
    it('should record event history', () => {
      eventManager.on('change', mockListener);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      const history = eventManager.getEventHistory();
      expect(history).toHaveLength(1);
      expect(history[0].event).toBe(event);
      expect(history[0].listenerCount).toBe(1);
      expect(typeof history[0].processingDuration).toBe('number');
    });

    it('should limit event history size', () => {
      // Create a new manager with smaller history size for testing
      const testManager = new StorageEventManager();
      testManager.on('change', mockListener);

      // Emit events beyond the default limit (1000)
      for (let i = 0; i < 1005; i++) {
        const event = StorageEventUtils.dataAdded(
          `key-${i}`,
          'value',
          'indexeddb'
        );
        testManager.emit(event);
      }

      const history = testManager.getEventHistory();
      expect(history.length).toBeLessThanOrEqual(1000);

      testManager.destroy();
    });

    it('should clear event history', () => {
      eventManager.on('change', mockListener);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      expect(eventManager.getEventHistory()).toHaveLength(1);

      eventManager.clearEventHistory();
      expect(eventManager.getEventHistory()).toHaveLength(0);
    });

    it('should get limited event history', () => {
      eventManager.on('change', mockListener);

      // Emit multiple events
      for (let i = 0; i < 5; i++) {
        const event = StorageEventUtils.dataAdded(
          `key-${i}`,
          'value',
          'indexeddb'
        );
        eventManager.emit(event);
      }

      const limitedHistory = eventManager.getEventHistory(3);
      expect(limitedHistory).toHaveLength(3);

      // Should get the most recent events
      expect(limitedHistory[0].event.data?.key).toBe('key-2');
      expect(limitedHistory[1].event.data?.key).toBe('key-3');
      expect(limitedHistory[2].event.data?.key).toBe('key-4');
    });
  });

  describe('Statistics', () => {
    it('should provide event manager statistics', () => {
      eventManager.on('change', mockListener);
      eventManager.on('error', mockErrorListener);

      const stats = eventManager.getStats();

      expect(stats.totalEventTypes).toBe(2);
      expect(stats.totalListeners).toBe(2);
      expect(stats.eventHistory).toBe(0);
      expect(stats.isDestroyed).toBe(false);
      expect(stats.eventTypeStats).toEqual({
        change: 1,
        error: 1,
      });
    });

    it('should update statistics after events', () => {
      eventManager.on('change', mockListener);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      const stats = eventManager.getStats();
      expect(stats.eventHistory).toBe(1);
    });
  });

  describe('Destruction and Cleanup', () => {
    it('should prevent operations after destruction', () => {
      eventManager.destroy();

      expect(() => {
        eventManager.on('change', mockListener);
      }).toThrow('StorageEventManager has been destroyed');
    });

    it('should clean up all resources on destruction', () => {
      eventManager.on('change', mockListener, { debounce: 100 });
      eventManager.on('error', mockErrorListener);

      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );
      eventManager.emit(event);

      eventManager.destroy();

      const stats = eventManager.getStats();
      expect(stats.totalEventTypes).toBe(0);
      expect(stats.totalListeners).toBe(0);
      expect(stats.eventHistory).toBe(0);
      expect(stats.isDestroyed).toBe(true);
    });

    it('should handle multiple destroy calls gracefully', () => {
      eventManager.destroy();

      expect(() => {
        eventManager.destroy();
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty event emissions', () => {
      // No listeners registered
      const event = StorageEventUtils.dataAdded(
        'test-key',
        'test-value',
        'indexeddb'
      );

      expect(() => {
        eventManager.emit(event);
      }).not.toThrow();

      const history = eventManager.getEventHistory();
      expect(history).toHaveLength(0);
    });

    it('should handle removing non-existent listeners', () => {
      expect(() => {
        eventManager.off('change', mockListener);
      }).not.toThrow();
    });

    it('should handle removing listeners from non-existent event types', () => {
      expect(() => {
        eventManager.removeAllListeners('change' as any);
      }).not.toThrow();
    });

    it('should generate unique listener IDs', () => {
      const unsubscribe1 = eventManager.on('change', vi.fn());
      const unsubscribe2 = eventManager.on('change', vi.fn());

      // IDs should be different (tested through successful separate removal)
      unsubscribe1();
      expect(eventManager.listenerCount('change')).toBe(1);

      unsubscribe2();
      expect(eventManager.listenerCount('change')).toBe(0);
    });
  });
});
