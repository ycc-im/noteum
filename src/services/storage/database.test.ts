/**
 * Database tests for NoteumDB implementation
 *
 * @fileoverview Tests for database initialization and basic operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NoteumDB, initializeDatabase, closeDatabase } from './database';
import { SCHEMA_CONSTANTS, TableNames } from './schema';
import type { TokenRecord, PreferenceRecord } from './schema';

// IndexedDB is set up in test-setup.ts

describe('NoteumDB Database', () => {
  let db: NoteumDB;

  beforeEach(async () => {
    // Create test database instance with unique name
    const dbName = `test_noteum_db_${Date.now()}_${Math.random()}`;
    db = new NoteumDB({
      name: dbName,
      debug: true,
      enableAutoCleanup: false,
    });
  });

  afterEach(async () => {
    if (db && db.isOpen()) {
      await db.close();
    }
  });

  describe('Database Initialization', () => {
    it('应该成功初始化数据库', async () => {
      await db.initialize();

      expect(db.isReady()).toBe(true);
      expect(db.getDatabaseName()).toContain('test_noteum_db');
      expect(db.getDatabaseVersion()).toBe(SCHEMA_CONSTANTS.CURRENT_VERSION);
    });

    it('应该创建所有必需的表', async () => {
      await db.initialize();

      const tables = db.tables;
      const tableNames = tables.map(table => table.name);

      expect(tableNames).toContain(TableNames.TOKENS);
      expect(tableNames).toContain(TableNames.USER_PREFERENCES);
      expect(tableNames).toContain(TableNames.APP_SETTINGS);
      expect(tableNames).toContain(TableNames.API_CACHE);
      expect(tableNames).toContain(TableNames.METADATA);
    });

    it('应该设置正确的数据库版本', async () => {
      await db.initialize();

      const versionRecord = await db.metadata.get('db_initialized');
      expect(versionRecord).toBeDefined();
      expect(versionRecord?.value.version).toBe(
        SCHEMA_CONSTANTS.CURRENT_VERSION
      );
    });
  });

  describe('Token Storage', () => {
    beforeEach(async () => {
      await db.initialize();
    });

    it('应该能够存储和检索token', async () => {
      const tokenRecord: TokenRecord = {
        key: 'test_token',
        value: 'token_value_123',
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'access',
        userId: 'user_123',
      };

      await db.tokens.add(tokenRecord);

      const retrieved = await db.tokens.get('test_token');
      expect(retrieved).toBeDefined();
      expect(retrieved?.value).toBe('token_value_123');
      expect(retrieved?.type).toBe('access');
      expect(retrieved?.userId).toBe('user_123');
    });

    it('应该自动设置createdAt时间戳', async () => {
      const tokenRecord: Partial<TokenRecord> = {
        key: 'auto_timestamp_token',
        value: 'value',
      };

      await db.tokens.add(tokenRecord as TokenRecord);

      const retrieved = await db.tokens.get('auto_timestamp_token');
      expect(retrieved?.createdAt).toBeInstanceOf(Date);
    });

    it('应该能够查询过期的token', async () => {
      const expiredToken: TokenRecord = {
        key: 'expired_token',
        value: 'expired_value',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiredAt: new Date(Date.now() - 1000), // 1秒前过期
      };

      const validToken: TokenRecord = {
        key: 'valid_token',
        value: 'valid_value',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiredAt: new Date(Date.now() + 1000), // 1秒后过期
      };

      await db.tokens.bulkAdd([expiredToken, validToken]);

      const expiredTokens = await db.tokens
        .where('expiredAt')
        .below(new Date())
        .toArray();

      expect(expiredTokens).toHaveLength(1);
      expect(expiredTokens[0].key).toBe('expired_token');
    });
  });

  describe('User Preferences Storage', () => {
    beforeEach(async () => {
      await db.initialize();
    });

    it('应该能够存储和检索用户偏好', async () => {
      const preference: PreferenceRecord = {
        key: 'theme',
        value: { mode: 'dark', color: 'blue' },
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user_123',
        category: 'ui',
      };

      await db.userPreferences.add(preference);

      const retrieved = await db.userPreferences.get('theme');
      expect(retrieved).toBeDefined();
      expect(retrieved?.value.mode).toBe('dark');
      expect(retrieved?.userId).toBe('user_123');
      expect(retrieved?.category).toBe('ui');
    });

    it('应该自动更新updatedAt时间戳', async () => {
      const preference: Partial<PreferenceRecord> = {
        key: 'auto_timestamp_pref',
        value: 'test_value',
        userId: 'user_123',
      };

      await db.userPreferences.add(preference as PreferenceRecord);

      const retrieved = await db.userPreferences.get('auto_timestamp_pref');
      expect(retrieved?.updatedAt).toBeInstanceOf(Date);
    });

    it('应该能够按用户ID查询偏好', async () => {
      const prefs: PreferenceRecord[] = [
        {
          key: 'pref1',
          value: 'value1',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user_1',
          category: 'ui',
        },
        {
          key: 'pref2',
          value: 'value2',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user_2',
          category: 'ui',
        },
        {
          key: 'pref3',
          value: 'value3',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user_1',
          category: 'app',
        },
      ];

      await db.userPreferences.bulkAdd(prefs);

      const user1Prefs = await db.userPreferences
        .where('userId')
        .equals('user_1')
        .toArray();

      expect(user1Prefs).toHaveLength(2);
      expect(user1Prefs.map(p => p.key)).toContain('pref1');
      expect(user1Prefs.map(p => p.key)).toContain('pref3');
    });
  });

  describe('Database Statistics', () => {
    beforeEach(async () => {
      await db.initialize();
    });

    it('应该返回正确的数据库统计信息', async () => {
      // 添加一些测试数据
      await db.tokens.add({
        key: 'test_token',
        value: 'value',
        createdAt: new Date(),
      });

      await db.userPreferences.add({
        key: 'test_pref',
        value: 'pref_value',
        updatedAt: new Date(),
      });

      const stats = await db.getStats();

      expect(stats.name).toContain('test_noteum_db');
      expect(stats.version).toBe(SCHEMA_CONSTANTS.CURRENT_VERSION);
      expect(stats.recordCount.tokens).toBe(1);
      expect(stats.recordCount.userPreferences).toBe(1);
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  describe('Database Cleanup', () => {
    beforeEach(async () => {
      await db.initialize();
    });

    it('应该清理过期的token', async () => {
      const expiredToken: TokenRecord = {
        key: 'expired_token',
        value: 'expired_value',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiredAt: new Date(Date.now() - 1000),
      };

      const validToken: TokenRecord = {
        key: 'valid_token',
        value: 'valid_value',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiredAt: new Date(Date.now() + 60000),
      };

      await db.tokens.bulkAdd([expiredToken, validToken]);

      const result = await db.cleanup({ expiredTokens: true });

      expect(result.breakdown.tokens).toBe(1);
      expect(result.recordsRemoved).toBe(1);

      const remainingTokens = await db.tokens.toArray();
      expect(remainingTokens).toHaveLength(1);
      expect(remainingTokens[0].key).toBe('valid_token');
    });

    it('应该支持dry run模式', async () => {
      const expiredToken: TokenRecord = {
        key: 'expired_token',
        value: 'expired_value',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiredAt: new Date(Date.now() - 1000),
      };

      await db.tokens.add(expiredToken);

      const result = await db.cleanup({
        expiredTokens: true,
        dryRun: true,
      });

      expect(result.breakdown.tokens).toBe(1);

      // 验证数据没有被实际删除
      const tokens = await db.tokens.toArray();
      expect(tokens).toHaveLength(1);
    });
  });
});

describe('Database Factory Functions', () => {
  afterEach(async () => {
    await closeDatabase();
  });

  it('应该能够初始化默认数据库实例', async () => {
    const dbName = `test_default_db_${Date.now()}_${Math.random()}`;
    const db = await initializeDatabase({
      name: dbName,
      debug: true,
    });

    expect(db.isReady()).toBe(true);
    expect(db.getDatabaseName()).toBe(dbName);
  });

  it('应该能够关闭默认数据库实例', async () => {
    const dbName = `test_close_db_${Date.now()}_${Math.random()}`;
    const db = await initializeDatabase({
      name: dbName,
      debug: true,
    });

    expect(db.isReady()).toBe(true);

    await closeDatabase();

    expect(db.isReady()).toBe(false);
  });
});
