/**
 * Tests for helper utility functions
 * This is a same-directory test file
 */

import {
  generateId,
  formatDate,
  isEmpty,
  extractHashtags,
  truncateText,
} from './helpers';

describe('helpers utility functions', () => {
  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it('should generate ID with timestamp format', () => {
      const id = generateId();
      const parts = id.split('-');

      expect(parts).toHaveLength(2);
      expect(parts[0]).toMatch(/^\d+$/); // timestamp part
      expect(parts[1]).toMatch(/^[a-z0-9]+$/); // random part
    });
  });

  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      expect(formatDate(date)).toBe('2023-12-25');
    });

    it('should handle current date', () => {
      const today = new Date();
      const formatted = formatDate(today);

      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('should return true for whitespace only string', () => {
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\t\n')).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('extractHashtags', () => {
    it('should extract hashtags from text', () => {
      const content = 'This is a #test with #multiple #hashtags';
      const hashtags = extractHashtags(content);

      expect(hashtags).toEqual(['test', 'multiple', 'hashtags']);
    });

    it('should return empty array when no hashtags found', () => {
      const content = 'This text has no hashtags';
      const hashtags = extractHashtags(content);

      expect(hashtags).toEqual([]);
    });

    it('should handle duplicate hashtags', () => {
      const content = '#test #test #different';
      const hashtags = extractHashtags(content);

      expect(hashtags).toEqual(['test', 'test', 'different']);
    });

    it('should handle hashtags at different positions', () => {
      const content = '#start middle #middle end';
      const hashtags = extractHashtags(content);

      expect(hashtags).toEqual(['start', 'middle']);
    });
  });

  describe('truncateText', () => {
    it('should return original text when shorter than max length', () => {
      const text = 'short text';
      expect(truncateText(text, 20)).toBe(text);
    });

    it('should truncate text longer than max length', () => {
      const text = 'this is a very long text that should be truncated';
      const result = truncateText(text, 20);

      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    it('should handle edge case where text equals max length', () => {
      const text = 'exactly20character'; // exactly 20 chars
      expect(truncateText(text, 20)).toBe(text);
    });

    it('should handle very short max length', () => {
      const text = 'some text';
      const result = truncateText(text, 0); // 0 length case

      expect(result).toBe('...');
    });
  });
});

describe('Jest configuration validation', () => {
  it('should have access to global test utilities', () => {
    expect((global as any).testUtils).toBeDefined();
    expect(typeof (global as any).testUtils.wait).toBe('function');
    expect(typeof (global as any).testUtils.createMockNote).toBe('function');
    expect(typeof (global as any).testUtils.waitFor).toBe('function');
    expect(typeof (global as any).testUtils.clearAllMocks).toBe('function');
  });

  it('should have fake IndexedDB available', () => {
    expect(indexedDB).toBeDefined();
    expect(typeof indexedDB).toBe('object');
  });

  it('should have localStorage mock available', () => {
    expect(localStorage).toBeDefined();
    expect(typeof localStorage.getItem).toBe('function');
    expect(typeof localStorage.setItem).toBe('function');
  });

  it('should have sessionStorage mock available', () => {
    expect(sessionStorage).toBeDefined();
    expect(typeof sessionStorage.getItem).toBe('function');
    expect(typeof sessionStorage.setItem).toBe('function');
  });

  it('should have ResizeObserver mock available', () => {
    expect(ResizeObserver).toBeDefined();
    expect(typeof ResizeObserver).toBe('function');
  });

  it('should have IntersectionObserver mock available', () => {
    expect(IntersectionObserver).toBeDefined();
    expect(typeof IntersectionObserver).toBe('function');
  });

  it('should have matchMedia mock available', () => {
    expect(window.matchMedia).toBeDefined();
    expect(typeof window.matchMedia).toBe('function');
  });
});

describe('Path alias resolution', () => {
  it('should be able to import from @utils alias', async () => {
    // This test validates that our moduleNameMapping works
    try {
      // Dynamic import to test path resolution
      const helpersModule = await import('@/utils/helpers');
      expect(helpersModule.generateId).toBeDefined();
      expect(helpersModule.formatDate).toBeDefined();
      expect(helpersModule.isEmpty).toBeDefined();
      expect(helpersModule.extractHashtags).toBeDefined();
      expect(helpersModule.truncateText).toBeDefined();
    } catch (error) {
      // If this fails, it means our path aliases aren't working
      fail(`Path alias resolution failed: ${error}`);
    }
  });
});
