/**
 * Data Migration Service tests
 * 
 * @fileoverview Tests for the main data migration service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DataMigrationService } from './data-migration-service';
import { NoteumDB } from './database';
import type { MigrationConfig, MigrationProgress } from './types';

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
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('DataMigrationService', () => {
  let migrationService: DataMigrationService;
  let db: NoteumDB;
  let testConfig: MigrationConfig;

  beforeEach(async () => {
    // Reset localStorage mock
    localStorageMock.clear();
    vi.clearAllMocks();

    // Create test database instance
    const dbName = `test_migration_db_${Date.now()}_${Math.random()}`;
    db = new NoteumDB({ 
      name: dbName,
      debug: true,
      enableAutoCleanup: false 
    });
    await db.initialize();

    // Setup test configuration
    testConfig = {
      batchSize: 5,
      enableBackup: true,
      validateData: true,
      cleanupAfterMigration: false, // Keep data for verification
      excludeKeys: ['test_exclude'],
      onProgress: vi.fn(),
      onError: vi.fn()
    };

    migrationService = new DataMigrationService(db, testConfig);

    // Setup test data in localStorage
    localStorageMock.setItem('auth_token', 'test_token_123');
    localStorageMock.setItem('user_preference_theme', 'dark');
    localStorageMock.setItem('app_setting_lang', 'zh-CN');
    localStorageMock.setItem('test_exclude', 'should_be_excluded');
    localStorageMock.setItem('cache_data_1', JSON.stringify({ id: 1, data: 'test' }));
  });

  afterEach(async () => {
    if (db && db.isOpen()) {
      await db.close();
    }
    localStorageMock.clear();
  });

  describe('Service Initialization', () => {
    it('应该正确初始化迁移服务', () => {
      expect(migrationService).toBeDefined();
      expect(migrationService.getConfig()).toEqual(testConfig);
    });

    it('应该设置默认配置值', () => {
      const defaultService = new DataMigrationService(db);
      const config = defaultService.getConfig();
      
      expect(config.batchSize).toBe(10);
      expect(config.enableBackup).toBe(true);
      expect(config.validateData).toBe(true);
      expect(config.cleanupAfterMigration).toBe(false);
    });
  });

  describe('Migration Status', () => {
    it('应该正确报告初始迁移状态', async () => {
      const status = await migrationService.getMigrationStatus();
      
      expect(status.isInProgress).toBe(false);
      expect(status.isCompleted).toBe(false);
      expect(status.totalItems).toBe(0);
      expect(status.processedItems).toBe(0);
    });
  });

  describe('Data Scanning', () => {
    it('应该正确扫描localStorage数据', async () => {
      const scanResult = await migrationService.scanLocalStorageData();
      
      expect(scanResult.totalItems).toBe(4); // Excluding 'test_exclude'
      expect(scanResult.estimatedSize).toBeGreaterThan(0);
      expect(scanResult.categories.tokens).toEqual(['auth_token']);
      expect(scanResult.categories.preferences).toEqual(['user_preference_theme']);
      expect(scanResult.categories.settings).toEqual(['app_setting_lang']);
      expect(scanResult.categories.cache).toEqual(['cache_data_1']);
    });

    it('应该排除配置中指定的keys', async () => {
      const scanResult = await migrationService.scanLocalStorageData();
      const allKeys = [
        ...scanResult.categories.tokens,
        ...scanResult.categories.preferences,
        ...scanResult.categories.settings,
        ...scanResult.categories.cache
      ];
      
      expect(allKeys).not.toContain('test_exclude');
    });
  });

  describe('Full Migration Process', () => {
    it('应该成功执行完整的迁移流程', async () => {
      const progressEvents: MigrationProgress[] = [];
      const configWithProgress = {
        ...testConfig,
        onProgress: (progress: MigrationProgress) => {
          progressEvents.push(progress);
        }
      };

      const serviceWithProgress = new DataMigrationService(db, configWithProgress);
      const result = await serviceWithProgress.migrateAllData();

      expect(result.success).toBe(true);
      expect(result.totalProcessed).toBe(4);
      expect(result.errors).toEqual([]);
      expect(progressEvents.length).toBeGreaterThan(0);
      
      // Verify last progress event shows completion
      const lastProgress = progressEvents[progressEvents.length - 1];
      expect(lastProgress.phase).toBe('validation');
      expect(lastProgress.isCompleted).toBe(true);
    });

    it('应该正确迁移tokens到IndexedDB', async () => {
      await migrationService.migrateAllData();
      
      const tokens = await db.tokens.toArray();
      const tokenData = tokens.find(t => t.key === 'auth_token');
      
      expect(tokenData).toBeDefined();
      expect(tokenData?.value).toBe('test_token_123');
      expect(tokenData?.type).toBe('access');
    });

    it('应该正确迁移用户偏好到IndexedDB', async () => {
      await migrationService.migrateAllData();
      
      const preferences = await db.userPreferences.toArray();
      const themePreference = preferences.find(p => p.key === 'user_preference_theme');
      
      expect(themePreference).toBeDefined();
      expect(themePreference?.value).toBe('dark');
    });

    it('应该正确迁移应用设置到IndexedDB', async () => {
      await migrationService.migrateAllData();
      
      const settings = await db.appSettings.toArray();
      const langSetting = settings.find(s => s.key === 'app_setting_lang');
      
      expect(langSetting).toBeDefined();
      expect(langSetting?.value).toBe('zh-CN');
    });

    it('应该正确迁移缓存数据到IndexedDB', async () => {
      await migrationService.migrateAllData();
      
      const cache = await db.apiCache.toArray();
      const cacheData = cache.find(c => c.key === 'cache_data_1');
      
      expect(cacheData).toBeDefined();
      expect(JSON.parse(cacheData?.value || '{}')).toEqual({ id: 1, data: 'test' });
    });
  });

  describe('Migration Validation', () => {
    it('应该验证迁移后的数据完整性', async () => {
      await migrationService.migrateAllData();
      
      const validationResult = await migrationService.validateMigration();
      
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.totalItems).toBe(4);
      expect(validationResult.validItems).toBe(4);
      expect(validationResult.missingItems).toEqual([]);
      expect(validationResult.mismatchedItems).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('应该处理数据库写入错误', async () => {
      // Mock database error
      const originalAdd = db.tokens.add;
      db.tokens.add = vi.fn().mockRejectedValue(new Error('Database write error'));

      const result = await migrationService.migrateAllData();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Database write error');

      // Restore original method
      db.tokens.add = originalAdd;
    });

    it('应该调用错误回调函数', async () => {
      const onError = vi.fn();
      const configWithError = { ...testConfig, onError };
      const serviceWithError = new DataMigrationService(db, configWithError);

      // Mock database error
      db.tokens.add = vi.fn().mockRejectedValue(new Error('Test error'));

      await serviceWithError.migrateAllData();

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('Migration Rollback', () => {
    it('应该支持迁移回滚', async () => {
      // First migrate data
      await migrationService.migrateAllData();
      
      // Verify data exists in IndexedDB
      const tokensBeforeRollback = await db.tokens.count();
      expect(tokensBeforeRollback).toBeGreaterThan(0);

      // Perform rollback
      const rollbackResult = await migrationService.rollbackMigration();
      
      expect(rollbackResult.success).toBe(true);
      
      // Verify data is removed from IndexedDB
      const tokensAfterRollback = await db.tokens.count();
      expect(tokensAfterRollback).toBe(0);
    });
  });

  describe('Configuration Updates', () => {
    it('应该允许更新配置', () => {
      const newConfig = { ...testConfig, batchSize: 20 };
      migrationService.updateConfig(newConfig);
      
      expect(migrationService.getConfig().batchSize).toBe(20);
    });
  });

  describe('Progress Tracking', () => {
    it('应该准确跟踪迁移进度', async () => {
      const progressEvents: MigrationProgress[] = [];
      const configWithProgress = {
        ...testConfig,
        batchSize: 2, // Small batch size to generate multiple progress events
        onProgress: (progress: MigrationProgress) => {
          progressEvents.push(progress);
        }
      };

      const serviceWithProgress = new DataMigrationService(db, configWithProgress);
      await serviceWithProgress.migrateAllData();

      expect(progressEvents.length).toBeGreaterThan(1);
      
      // Check progress increases over time
      for (let i = 1; i < progressEvents.length; i++) {
        expect(progressEvents[i].processedItems).toBeGreaterThanOrEqual(
          progressEvents[i - 1].processedItems
        );
      }
    });
  });
});