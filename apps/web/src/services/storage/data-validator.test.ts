/**
 * Data Validator tests
 * 
 * @fileoverview Tests for data validation and integrity checking
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DataValidator } from './data-validator';
import type { MigrationItem, ValidationOptions } from './types';

describe('DataValidator', () => {
  let validator: DataValidator;

  beforeEach(() => {
    validator = new DataValidator();
  });

  describe('Basic Validation', () => {
    it('应该验证简单字符串数据', () => {
      const originalData = 'test_value';
      const migratedData = 'test_value';
      
      const result = validator.validateItem('test_key', originalData, migratedData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('应该检测数据不匹配', () => {
      const originalData = 'original_value';
      const migratedData = 'different_value';
      
      const result = validator.validateItem('test_key', originalData, migratedData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Data mismatch: values do not match');
    });

    it('应该处理null和undefined值', () => {
      const result1 = validator.validateItem('test_key', null, null);
      expect(result1.isValid).toBe(true);
      
      const result2 = validator.validateItem('test_key', undefined, undefined);
      expect(result2.isValid).toBe(true);
      
      const result3 = validator.validateItem('test_key', null, undefined);
      expect(result3.isValid).toBe(false);
    });
  });

  describe('JSON Data Validation', () => {
    it('应该验证JSON对象', () => {
      const originalData = JSON.stringify({ id: 1, name: 'test', active: true });
      const migratedData = JSON.stringify({ id: 1, name: 'test', active: true });
      
      const result = validator.validateItem('json_key', originalData, migratedData);
      
      expect(result.isValid).toBe(true);
    });

    it('应该检测JSON结构差异', () => {
      const originalData = JSON.stringify({ id: 1, name: 'test' });
      const migratedData = JSON.stringify({ id: 1, name: 'test', extra: 'field' });
      
      const result = validator.validateItem('json_key', originalData, migratedData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('JSON structure mismatch');
    });

    it('应该处理复杂嵌套JSON', () => {
      const complexObject = {
        user: {
          id: 123,
          profile: {
            name: 'John Doe',
            settings: {
              theme: 'dark',
              notifications: true,
              preferences: ['email', 'sms']
            }
          }
        },
        metadata: {
          created: '2024-01-01',
          updated: null
        }
      };
      
      const originalData = JSON.stringify(complexObject);
      const migratedData = JSON.stringify(complexObject);
      
      const result = validator.validateItem('complex_json', originalData, migratedData);
      
      expect(result.isValid).toBe(true);
    });

    it('应该检测嵌套JSON中的细微差异', () => {
      const original = { user: { settings: { theme: 'dark' } } };
      const migrated = { user: { settings: { theme: 'light' } } };
      
      const result = validator.validateItem('nested_json', 
        JSON.stringify(original), 
        JSON.stringify(migrated)
      );
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('JSON structure mismatch');
    });
  });

  describe('Checksum Generation and Validation', () => {
    it('应该为字符串数据生成校验和', () => {
      const data = 'test_string_data';
      const checksum = validator.generateChecksum(data);
      
      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBeGreaterThan(0);
    });

    it('应该为相同数据生成相同校验和', () => {
      const data = 'consistent_data';
      const checksum1 = validator.generateChecksum(data);
      const checksum2 = validator.generateChecksum(data);
      
      expect(checksum1).toBe(checksum2);
    });

    it('应该为不同数据生成不同校验和', () => {
      const data1 = 'first_data';
      const data2 = 'second_data';
      const checksum1 = validator.generateChecksum(data1);
      const checksum2 = validator.generateChecksum(data2);
      
      expect(checksum1).not.toBe(checksum2);
    });

    it('应该验证校验和匹配', () => {
      const data = { id: 1, value: 'test' };
      const checksum = validator.generateChecksum(data);
      
      const isValid = validator.verifyChecksum(data, checksum);
      
      expect(isValid).toBe(true);
    });

    it('应该检测校验和不匹配', () => {
      const originalData = { id: 1, value: 'test' };
      const modifiedData = { id: 1, value: 'modified' };
      const checksum = validator.generateChecksum(originalData);
      
      const isValid = validator.verifyChecksum(modifiedData, checksum);
      
      expect(isValid).toBe(false);
    });
  });

  describe('Batch Validation', () => {
    it('应该验证多个迁移项目', () => {
      const items: MigrationItem[] = [
        {
          key: 'item1',
          originalValue: 'value1',
          migratedValue: 'value1',
          category: 'test',
          size: 12
        },
        {
          key: 'item2',
          originalValue: JSON.stringify({ id: 2 }),
          migratedValue: JSON.stringify({ id: 2 }),
          category: 'test',
          size: 20
        },
        {
          key: 'item3',
          originalValue: 'original',
          migratedValue: 'different', // This should fail
          category: 'test',
          size: 15
        }
      ];
      
      const result = validator.validateBatch(items);
      
      expect(result.totalItems).toBe(3);
      expect(result.validItems).toBe(2);
      expect(result.invalidItems).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].key).toBe('item3');
    });

    it('应该提供详细的批量验证结果', () => {
      const items: MigrationItem[] = [
        {
          key: 'valid_item',
          originalValue: 'test_value',
          migratedValue: 'test_value',
          category: 'test',
          size: 20
        }
      ];
      
      const result = validator.validateBatch(items);
      
      expect(result.isValid).toBe(true);
      expect(result.successRate).toBe(1.0);
      expect(result.details).toHaveLength(1);
      expect(result.details[0].key).toBe('valid_item');
      expect(result.details[0].isValid).toBe(true);
    });
  });

  describe('Validation Options', () => {
    it('应该支持严格模式验证', () => {
      const options: ValidationOptions = {
        strictMode: true,
        ignoreWhitespace: false,
        ignoreCaseForStrings: false
      };
      
      // Whitespace difference should fail in strict mode
      const result = validator.validateItem(
        'test_key', 
        'value', 
        'value ', // Extra space
        options
      );
      
      expect(result.isValid).toBe(false);
    });

    it('应该支持忽略空白字符', () => {
      const options: ValidationOptions = {
        strictMode: false,
        ignoreWhitespace: true,
        ignoreCaseForStrings: false
      };
      
      const result = validator.validateItem(
        'test_key', 
        'value', 
        ' value ', // Whitespace differences
        options
      );
      
      expect(result.isValid).toBe(true);
    });

    it('应该支持忽略大小写', () => {
      const options: ValidationOptions = {
        strictMode: false,
        ignoreWhitespace: false,
        ignoreCaseForStrings: true
      };
      
      const result = validator.validateItem(
        'test_key', 
        'VALUE', 
        'value', // Case difference
        options
      );
      
      expect(result.isValid).toBe(true);
    });

    it('应该支持自定义验证函数', () => {
      const options: ValidationOptions = {
        customValidator: (original: any, migrated: any) => {
          // Custom logic: accept if migrated value is uppercase version of original
          return migrated === original.toUpperCase();
        }
      };
      
      const result = validator.validateItem(
        'test_key', 
        'hello', 
        'HELLO',
        options
      );
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('Data Type Specific Validation', () => {
    it('应该验证数字类型转换', () => {
      // localStorage stores numbers as strings
      const result = validator.validateItem('number_key', '123', '123');
      
      expect(result.isValid).toBe(true);
    });

    it('应该验证布尔值转换', () => {
      const result = validator.validateItem('boolean_key', 'true', 'true');
      
      expect(result.isValid).toBe(true);
    });

    it('应该验证日期字符串', () => {
      const dateString = '2024-01-01T00:00:00.000Z';
      const result = validator.validateItem('date_key', dateString, dateString);
      
      expect(result.isValid).toBe(true);
    });

    it('应该检测数据类型不一致', () => {
      const result = validator.validateItem('type_key', '123', 123 as any);
      
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Type mismatch');
    });
  });

  describe('Error Reporting', () => {
    it('应该提供详细的错误信息', () => {
      const result = validator.validateItem(
        'error_test_key', 
        'original_value', 
        'different_value'
      );
      
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Data mismatch');
      expect(result.errors[0]).toContain('original_value');
      expect(result.errors[0]).toContain('different_value');
    });

    it('应该报告JSON解析错误', () => {
      const invalidJson = '{"invalid": json}';
      const validJson = '{"valid": "json"}';
      
      const result = validator.validateItem('json_error_key', invalidJson, validJson);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('JSON'))).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    it('应该高效处理大量数据验证', () => {
      const largeData = 'x'.repeat(10000); // 10KB string
      
      const startTime = Date.now();
      const result = validator.validateItem('large_data_key', largeData, largeData);
      const endTime = Date.now();
      
      expect(result.isValid).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });

    it('应该高效处理大批量验证', () => {
      const items: MigrationItem[] = [];
      
      // Create 1000 test items
      for (let i = 0; i < 1000; i++) {
        items.push({
          key: `item_${i}`,
          originalValue: `value_${i}`,
          migratedValue: `value_${i}`,
          category: 'test',
          size: 20
        });
      }
      
      const startTime = Date.now();
      const result = validator.validateBatch(items);
      const endTime = Date.now();
      
      expect(result.isValid).toBe(true);
      expect(result.totalItems).toBe(1000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});