import { z } from 'zod';
import {
  ulidSchema,
  optionalUlidSchema,
  uuidToUlidSchema,
  ulidArraySchema,
  optionalUlidArraySchema,
  createUlidSchema,
  bulkUlidSchema,
  ulidWithTimestampSchema,
} from '../utils/ulid-schema';
import { UlidGenerator, generateUlid } from '../utils/ulid';

describe('ULID Schema Validations', () => {
  const validUlid = generateUlid();
  const invalidUlids = [
    '', // Empty string
    'invalid', // Too short
    '01AN4Z07BY79KA1307SR9X4MV3X', // Too long
    '01AN4Z07BY79KA1307SR9X4MVI', // Contains 'I'
    'lowercase_not_allowed_123456', // Contains lowercase
  ];

  describe('ulidSchema', () => {
    it('should validate correct ULID', () => {
      const result = ulidSchema.safeParse(validUlid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validUlid);
      }
    });

    it('should reject invalid ULIDs', () => {
      invalidUlids.forEach(invalidUlid => {
        const result = ulidSchema.safeParse(invalidUlid);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Invalid ULID format');
        }
      });
    });

    it('should reject non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, []];
      
      nonStringValues.forEach(value => {
        const result = ulidSchema.safeParse(value);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('optionalUlidSchema', () => {
    it('should accept valid ULID', () => {
      const result = optionalUlidSchema.safeParse(validUlid);
      expect(result.success).toBe(true);
    });

    it('should accept undefined', () => {
      const result = optionalUlidSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('should reject invalid ULIDs', () => {
      const result = optionalUlidSchema.safeParse('invalid');
      expect(result.success).toBe(false);
    });
  });

  describe('uuidToUlidSchema', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const invalidUuid = 'not-a-uuid-or-ulid';

    it('should pass through valid ULID unchanged', () => {
      const result = uuidToUlidSchema.safeParse(validUlid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validUlid);
      }
    });

    it('should convert UUID to ULID', () => {
      const result = uuidToUlidSchema.safeParse(validUuid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(UlidGenerator.isValid(result.data)).toBe(true);
        expect(result.data).not.toBe(validUuid); // Should be different
      }
    });

    it('should reject invalid formats', () => {
      const result = uuidToUlidSchema.safeParse(invalidUuid);
      expect(result.success).toBe(false);
    });
  });

  describe('ulidArraySchema', () => {
    it('should validate array of valid ULIDs', () => {
      const validUlids = [generateUlid(), generateUlid(), generateUlid()];
      const result = ulidArraySchema.safeParse(validUlids);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUlids);
      }
    });

    it('should reject array with invalid ULIDs', () => {
      const mixedArray = [validUlid, 'invalid'];
      const result = ulidArraySchema.safeParse(mixedArray);
      
      expect(result.success).toBe(false);
    });

    it('should accept empty array', () => {
      const result = ulidArraySchema.safeParse([]);
      expect(result.success).toBe(true);
    });

    it('should reject non-array values', () => {
      const result = ulidArraySchema.safeParse('not-an-array');
      expect(result.success).toBe(false);
    });
  });

  describe('optionalUlidArraySchema', () => {
    it('should accept valid array', () => {
      const validUlids = [generateUlid(), generateUlid()];
      const result = optionalUlidArraySchema.safeParse(validUlids);
      
      expect(result.success).toBe(true);
    });

    it('should accept undefined', () => {
      const result = optionalUlidArraySchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('should reject invalid array', () => {
      const result = optionalUlidArraySchema.safeParse(['invalid']);
      expect(result.success).toBe(false);
    });
  });

  describe('createUlidSchema', () => {
    it('should create schema with default error message', () => {
      const schema = createUlidSchema();
      const result = schema.safeParse('invalid');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid ULID format');
      }
    });

    it('should create schema with custom error message', () => {
      const fieldName = 'userId';
      const schema = createUlidSchema(fieldName);
      const result = schema.safeParse('invalid');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(fieldName);
      }
    });

    it('should validate correct ULID', () => {
      const schema = createUlidSchema('testField');
      const result = schema.safeParse(validUlid);
      
      expect(result.success).toBe(true);
    });
  });

  describe('bulkUlidSchema', () => {
    it('should validate bulk operation with valid ULIDs', () => {
      const validData = {
        ids: [generateUlid(), generateUlid(), generateUlid()],
      };
      
      const result = bulkUlidSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty ids array', () => {
      const result = bulkUlidSchema.safeParse({ ids: [] });
      expect(result.success).toBe(false);
    });

    it('should reject too many ids (over 100)', () => {
      const tooManyIds = Array.from({ length: 101 }, () => generateUlid());
      const result = bulkUlidSchema.safeParse({ ids: tooManyIds });
      
      expect(result.success).toBe(false);
    });

    it('should accept maximum allowed ids (100)', () => {
      const maxIds = Array.from({ length: 100 }, () => generateUlid());
      const result = bulkUlidSchema.safeParse({ ids: maxIds });
      
      expect(result.success).toBe(true);
    });

    it('should reject invalid ULIDs in bulk', () => {
      const result = bulkUlidSchema.safeParse({
        ids: [validUlid, 'invalid'],
      });
      
      expect(result.success).toBe(false);
    });
  });

  describe('ulidWithTimestampSchema', () => {
    it('should validate ULID with reasonable timestamp', () => {
      const currentUlid = generateUlid();
      const result = ulidWithTimestampSchema.safeParse(currentUlid);
      
      expect(result.success).toBe(true);
    });

    it('should validate ULID with past timestamp', () => {
      const pastTimestamp = Date.now() - 1000 * 60 * 60 * 24; // 1 day ago
      const pastUlid = UlidGenerator.generateWithTimestamp(pastTimestamp);
      const result = ulidWithTimestampSchema.safeParse(pastUlid);
      
      expect(result.success).toBe(true);
    });

    it('should accept ULID with near-future timestamp (within 1 day)', () => {
      const nearFutureTimestamp = Date.now() + 1000 * 60 * 30; // 30 minutes
      const futureUlid = UlidGenerator.generateWithTimestamp(nearFutureTimestamp);
      const result = ulidWithTimestampSchema.safeParse(futureUlid);
      
      expect(result.success).toBe(true);
    });

    it('should reject ULID with far future timestamp', () => {
      const farFutureTimestamp = Date.now() + 1000 * 60 * 60 * 24 * 2; // 2 days
      const farFutureUlid = UlidGenerator.generateWithTimestamp(farFutureTimestamp);
      const result = ulidWithTimestampSchema.safeParse(farFutureUlid);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('too far in the future');
      }
    });

    it('should reject invalid ULID format', () => {
      const result = ulidWithTimestampSchema.safeParse('invalid');
      expect(result.success).toBe(false);
    });
  });

  describe('Schema integration with complex objects', () => {
    const UserSchema = z.object({
      id: ulidSchema,
      name: z.string(),
      email: z.string().email(),
      friendIds: optionalUlidArraySchema,
      parentId: optionalUlidSchema,
    });

    it('should validate complete user object', () => {
      const user = {
        id: generateUlid(),
        name: 'John Doe',
        email: 'john@example.com',
        friendIds: [generateUlid(), generateUlid()],
        parentId: generateUlid(),
      };

      const result = UserSchema.safeParse(user);
      expect(result.success).toBe(true);
    });

    it('should handle optional fields correctly', () => {
      const user = {
        id: generateUlid(),
        name: 'Jane Doe',
        email: 'jane@example.com',
        friendIds: undefined,
        parentId: undefined,
      };

      const result = UserSchema.safeParse(user);
      expect(result.success).toBe(true);
    });

    it('should reject object with invalid ULID fields', () => {
      const user = {
        id: 'invalid-ulid',
        name: 'Invalid User',
        email: 'invalid@example.com',
        friendIds: [generateUlid()],
        parentId: generateUlid(),
      };

      const result = UserSchema.safeParse(user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('id') && issue.message.includes('Invalid ULID format')
        )).toBe(true);
      }
    });
  });

  describe('Performance tests', () => {
    it('should validate many ULIDs efficiently', () => {
      const ulids = Array.from({ length: 1000 }, () => generateUlid());
      
      const startTime = Date.now();
      const results = ulids.map(ulid => ulidSchema.safeParse(ulid));
      const endTime = Date.now();
      
      // Should complete in reasonable time (under 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
      
      // All should be valid
      expect(results.every(result => result.success)).toBe(true);
    });

    it('should handle bulk validation efficiently', () => {
      const bulkData = {
        ids: Array.from({ length: 100 }, () => generateUlid()),
      };
      
      const startTime = Date.now();
      const result = bulkUlidSchema.safeParse(bulkData);
      const endTime = Date.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should be very fast
    });
  });
});