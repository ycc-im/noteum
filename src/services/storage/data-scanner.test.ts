/**
 * Data Scanner tests
 *
 * @fileoverview Tests for localStorage data scanning functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataScanner } from './data-scanner';
import type { ScanOptions } from './types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('DataScanner', () => {
  let scanner: DataScanner;

  beforeEach(() => {
    // Reset localStorage mock
    localStorageMock.clear();
    vi.clearAllMocks();

    scanner = new DataScanner();

    // Setup comprehensive test data
    localStorageMock.setItem(
      'auth_token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    );
    localStorageMock.setItem('refresh_token', 'refresh_abc123');
    localStorageMock.setItem('api_key_service1', 'sk-abc123def456');

    localStorageMock.setItem('user_preference_theme', 'dark');
    localStorageMock.setItem('user_preference_language', 'zh-CN');
    localStorageMock.setItem(
      'user_preference_sidebar',
      JSON.stringify({ collapsed: false })
    );

    localStorageMock.setItem('app_setting_debug', 'true');
    localStorageMock.setItem('app_setting_version', '1.2.3');
    localStorageMock.setItem(
      'app_setting_features',
      JSON.stringify(['feature1', 'feature2'])
    );

    localStorageMock.setItem(
      'cache_api_users',
      JSON.stringify({ lastFetch: Date.now(), data: [] })
    );
    localStorageMock.setItem(
      'cache_static_config',
      JSON.stringify({ config: 'value' })
    );

    localStorageMock.setItem('unknown_key_1', 'some_value');
    localStorageMock.setItem('temp_data', JSON.stringify({ temp: true }));

    // Empty and null values
    localStorageMock.setItem('empty_string', '');
    localStorageMock.setItem('null_value', 'null');
  });

  describe('Basic Scanning', () => {
    it('应该扫描所有localStorage项目', async () => {
      const result = await scanner.scanAllData();

      expect(result.totalItems).toBe(14);
      expect(result.totalSize).toBeGreaterThan(0);
      expect(result.categories).toBeDefined();
    });

    it('应该正确分类tokens', async () => {
      const result = await scanner.scanAllData();

      expect(result.categories.tokens).toEqual([
        'auth_token',
        'refresh_token',
        'api_key_service1',
      ]);
    });

    it('应该正确分类用户偏好', async () => {
      const result = await scanner.scanAllData();

      expect(result.categories.preferences).toEqual([
        'user_preference_theme',
        'user_preference_language',
        'user_preference_sidebar',
      ]);
    });

    it('应该正确分类应用设置', async () => {
      const result = await scanner.scanAllData();

      expect(result.categories.settings).toEqual([
        'app_setting_debug',
        'app_setting_version',
        'app_setting_features',
      ]);
    });

    it('应该正确分类缓存数据', async () => {
      const result = await scanner.scanAllData();

      expect(result.categories.cache).toEqual([
        'cache_api_users',
        'cache_static_config',
      ]);
    });

    it('应该识别未分类的数据', async () => {
      const result = await scanner.scanAllData();

      expect(result.categories.other).toContain('unknown_key_1');
      expect(result.categories.other).toContain('temp_data');
      expect(result.categories.other).toContain('empty_string');
      expect(result.categories.other).toContain('null_value');
    });
  });

  describe('Size Calculation', () => {
    it('应该正确计算数据大小', async () => {
      const result = await scanner.scanAllData();

      // Each character in UTF-16 is typically 2 bytes
      // 'auth_token' key (10 chars) + 'eyJhbGci...' value (~40 chars) ≈ 100 bytes
      expect(result.totalSize).toBeGreaterThan(100);
      expect(result.averageItemSize).toBeGreaterThan(0);
    });

    it('应该处理空值和特殊值', async () => {
      localStorageMock.clear();
      localStorageMock.setItem('empty', '');
      localStorageMock.setItem('null', 'null');
      localStorageMock.setItem('undefined', 'undefined');

      const result = await scanner.scanAllData();

      expect(result.totalItems).toBe(3);
      expect(result.totalSize).toBeGreaterThan(0); // Keys still have size
    });
  });

  describe('Filtering Options', () => {
    it('应该支持排除特定keys', async () => {
      const options: ScanOptions = {
        excludeKeys: ['auth_token', 'unknown_key_1'],
      };

      const result = await scanner.scanAllData(options);

      expect(result.categories.tokens).not.toContain('auth_token');
      expect(result.categories.other).not.toContain('unknown_key_1');
      expect(result.totalItems).toBe(12); // 14 - 2 excluded
    });

    it('应该支持排除特定模式', async () => {
      const options: ScanOptions = {
        excludePatterns: ['cache_*', 'temp_*'],
      };

      const result = await scanner.scanAllData(options);

      expect(result.categories.cache).toEqual([]);
      expect(result.categories.other).not.toContain('temp_data');
      expect(result.totalItems).toBe(11); // Excluding 3 cache items and temp_data
    });

    it('应该支持只包含特定类别', async () => {
      const options: ScanOptions = {
        includeCategories: ['tokens', 'preferences'],
      };

      const result = await scanner.scanAllData(options);

      expect(result.categories.settings).toEqual([]);
      expect(result.categories.cache).toEqual([]);
      expect(result.categories.other).toEqual([]);
      expect(result.totalItems).toBe(6); // 3 tokens + 3 preferences
    });

    it('应该支持最大项目数限制', async () => {
      const options: ScanOptions = {
        maxItems: 5,
      };

      const result = await scanner.scanAllData(options);

      expect(result.totalItems).toBe(5);
      expect(result.hasMore).toBe(true);
    });
  });

  describe('Data Type Detection', () => {
    it('应该识别JSON数据', async () => {
      const items = await scanner.scanByCategory('preferences');
      const sidebarItem = items.find(
        item => item.key === 'user_preference_sidebar'
      );

      expect(sidebarItem?.isJSON).toBe(true);
      expect(sidebarItem?.dataType).toBe('object');
    });

    it('应该识别字符串数据', async () => {
      const items = await scanner.scanByCategory('tokens');
      const tokenItem = items.find(item => item.key === 'auth_token');

      expect(tokenItem?.isJSON).toBe(false);
      expect(tokenItem?.dataType).toBe('string');
    });

    it('应该识别布尔值', async () => {
      const items = await scanner.scanByCategory('settings');
      const debugItem = items.find(item => item.key === 'app_setting_debug');

      expect(debugItem?.dataType).toBe('string'); // localStorage stores as string
      expect(debugItem?.value).toBe('true');
    });
  });

  describe('Category-specific Scanning', () => {
    it('应该扫描特定类别的数据', async () => {
      const tokenItems = await scanner.scanByCategory('tokens');

      expect(tokenItems).toHaveLength(3);
      expect(
        tokenItems.every(
          item => item.key.includes('token') || item.key.includes('api_key')
        )
      ).toBe(true);
    });

    it('应该返回详细的项目信息', async () => {
      const preferenceItems = await scanner.scanByCategory('preferences');
      const themeItem = preferenceItems.find(
        item => item.key === 'user_preference_theme'
      );

      expect(themeItem).toMatchObject({
        key: 'user_preference_theme',
        value: 'dark',
        size: expect.any(Number),
        category: 'preferences',
        dataType: 'string',
        isJSON: false,
        isValid: true,
      });
    });
  });

  describe('Data Validation', () => {
    it('应该验证JSON数据的有效性', async () => {
      // Add invalid JSON
      localStorageMock.setItem('invalid_json', '{"incomplete": json}');

      const result = await scanner.scanAllData();
      const invalidItem = result.items?.find(
        item => item.key === 'invalid_json'
      );

      expect(invalidItem?.isValid).toBe(false);
      expect(invalidItem?.isJSON).toBe(false); // Invalid JSON treated as string
    });

    it('应该处理大型数据项', async () => {
      const largeData = 'x'.repeat(10000); // 10KB string
      localStorageMock.setItem('large_data', largeData);

      const result = await scanner.scanAllData();
      const largeItem = result.items?.find(item => item.key === 'large_data');

      expect(largeItem?.size).toBeGreaterThan(10000);
      expect(largeItem?.isValid).toBe(true);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('应该处理空的localStorage', async () => {
      localStorageMock.clear();

      const result = await scanner.scanAllData();

      expect(result.totalItems).toBe(0);
      expect(result.totalSize).toBe(0);
      expect(result.categories.tokens).toEqual([]);
    });

    it('应该处理localStorage访问错误', async () => {
      // Mock localStorage.key to throw error
      localStorageMock.key = vi.fn().mockImplementation(() => {
        throw new Error('Storage access error');
      });

      const result = await scanner.scanAllData();

      expect(result.totalItems).toBe(0);
      expect(result.error).toBeDefined();
    });

    it('应该在大量数据时保持性能', async () => {
      // Add many items
      for (let i = 0; i < 1000; i++) {
        localStorageMock.setItem(`test_item_${i}`, `value_${i}`);
      }

      const startTime = Date.now();
      const result = await scanner.scanAllData();
      const endTime = Date.now();

      expect(result.totalItems).toBe(1014); // 14 original + 1000 new
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Utility Methods', () => {
    it('应该估算迁移时间', async () => {
      const estimate = await scanner.estimateMigrationTime();

      expect(estimate.estimatedTimeMs).toBeGreaterThan(0);
      expect(estimate.itemCount).toBe(14);
      expect(estimate.totalSizeBytes).toBeGreaterThan(0);
    });

    it('应该生成扫描报告', async () => {
      const report = await scanner.generateScanReport();

      expect(report).toContain('扫描报告');
      expect(report).toContain('总项目数');
      expect(report).toContain('数据分类');
      expect(report).toContain('tokens');
      expect(report).toContain('preferences');
    });
  });
});
