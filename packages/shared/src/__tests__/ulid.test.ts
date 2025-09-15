import { UlidGenerator, generateUlid, generateMonotonicUlid, isValidUlid, compareUlids } from '../utils/ulid';

describe('UlidGenerator', () => {
  describe('generate()', () => {
    it('should generate a valid ULID', () => {
      const ulid = UlidGenerator.generate();
      expect(ulid).toHaveLength(26);
      expect(UlidGenerator.isValid(ulid)).toBe(true);
    });

    it('should generate unique ULIDs', () => {
      const ulid1 = UlidGenerator.generate();
      const ulid2 = UlidGenerator.generate();
      expect(ulid1).not.toBe(ulid2);
    });

    it('should generate ULIDs with valid Crockford base32 characters', () => {
      const ulid = UlidGenerator.generate();
      // ULID should only contain Crockford base32 characters (0-9, A-Z except I, L, O, U)
      expect(ulid).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    });
  });

  describe('generateMonotonic()', () => {
    it('should generate a valid monotonic ULID', () => {
      const ulid = UlidGenerator.generateMonotonic();
      expect(ulid).toHaveLength(26);
      expect(UlidGenerator.isValid(ulid)).toBe(true);
    });

    it('should generate monotonic ULIDs in order', () => {
      const ulids: string[] = [];
      // Generate multiple ULIDs quickly
      for (let i = 0; i < 10; i++) {
        ulids.push(UlidGenerator.generateMonotonic());
      }

      // Check that they are in lexicographical order
      const sortedUlids = [...ulids].sort();
      expect(ulids).toEqual(sortedUlids);
    });
  });

  describe('generateWithTimestamp()', () => {
    it('should generate a ULID with specific timestamp', () => {
      const timestamp = Date.now();
      const ulid = UlidGenerator.generateWithTimestamp(timestamp);
      
      expect(ulid).toHaveLength(26);
      expect(UlidGenerator.isValid(ulid)).toBe(true);
      expect(UlidGenerator.decodeTimestamp(ulid)).toBe(timestamp);
    });

    it('should handle edge case timestamps', () => {
      const timestamps = [
        1000000, // Early timestamp but not 0
        Date.now(), // Current time  
        Date.now() + 1000 * 60 * 60 * 24, // 1 day in future
      ];

      timestamps.forEach(timestamp => {
        const ulid = UlidGenerator.generateWithTimestamp(timestamp);
        expect(UlidGenerator.isValid(ulid)).toBe(true);
        expect(UlidGenerator.decodeTimestamp(ulid)).toBe(timestamp);
      });
    });
  });

  describe('isValid()', () => {
    it('should return true for valid ULIDs', () => {
      const validUlids = [
        UlidGenerator.generate(),
        '01ARYZ6S41TSV4RRFFQ69G5FAV', // Example from ULID spec
        '01BX5ZZKBKACTAV9WEVGEMMVRY', // Another example
      ];

      validUlids.forEach(ulid => {
        expect(UlidGenerator.isValid(ulid)).toBe(true);
      });
    });

    it('should return false for invalid ULIDs', () => {
      const invalidUlids = [
        '', // Empty string
        'invalid', // Too short
        '01AN4Z07BY79KA1307SR9X4MV3X', // Too long (27 chars)
        '01AN4Z07BY79KA1307SR9X4MV', // Too short (25 chars)
        '01AN4Z07BY79KA1307SR9X4MVI', // Contains invalid char 'I'
        '01AN4Z07BY79KA1307SR9X4MVL', // Contains invalid char 'L'
        '01AN4Z07BY79KA1307SR9X4MVO', // Contains invalid char 'O'
        '01AN4Z07BY79KA1307SR9X4MVU', // Contains invalid char 'U'
        'zzzzzzzzzzzzzzzzzzzzzzzzzy', // Future timestamp (too far)
      ];

      invalidUlids.forEach(ulid => {
        expect(UlidGenerator.isValid(ulid)).toBe(false);
      });
    });

    it('should validate timestamp range', () => {
      const futureUlid = '7ZZZZZZZZZZZZZZZZZZZZZZZZZ'; // Very far future timestamp
      expect(UlidGenerator.isValid(futureUlid)).toBe(false);
    });
  });

  describe('decodeTimestamp()', () => {
    it('should decode timestamp from ULID', () => {
      const timestamp = Date.now();
      const ulid = UlidGenerator.generateWithTimestamp(timestamp);
      const decodedTimestamp = UlidGenerator.decodeTimestamp(ulid);
      
      expect(decodedTimestamp).toBe(timestamp);
    });

    it('should throw error for invalid ULID format', () => {
      expect(() => {
        UlidGenerator.decodeTimestamp('invalid');
      }).toThrow('Invalid ULID format');
    });

    it('should decode known ULID timestamps correctly', () => {
      // Test with known ULID values from the official documentation
      const testCases = [
        { ulid: '01ARYZ6S41TSV4RRFFQ69G5FAV', expectedTimestamp: 1469918176385 },
      ];

      testCases.forEach(({ ulid, expectedTimestamp }) => {
        expect(UlidGenerator.decodeTimestamp(ulid)).toBe(expectedTimestamp);
      });
    });
  });

  describe('getDate()', () => {
    it('should return correct date from ULID', () => {
      const timestamp = Date.now();
      const ulid = UlidGenerator.generateWithTimestamp(timestamp);
      const date = UlidGenerator.getDate(ulid);
      
      expect(date.getTime()).toBe(timestamp);
    });

    it('should handle edge case dates', () => {
      const testTimestamps = [
        1000000, // Early timestamp but not 0
        1469918176385, // Known test case
        Date.now(),
      ];

      testTimestamps.forEach(timestamp => {
        const ulid = UlidGenerator.generateWithTimestamp(timestamp);
        const date = UlidGenerator.getDate(ulid);
        expect(date.getTime()).toBe(timestamp);
      });
    });
  });

  describe('compare()', () => {
    it('should compare ULIDs lexicographically', () => {
      const ulid1 = UlidGenerator.generateWithTimestamp(1000);
      const ulid2 = UlidGenerator.generateWithTimestamp(2000);
      const ulid3 = UlidGenerator.generateWithTimestamp(2000);

      expect(UlidGenerator.compare(ulid1, ulid2)).toBe(-1);
      expect(UlidGenerator.compare(ulid2, ulid1)).toBe(1);
      expect(UlidGenerator.compare(ulid2, ulid3)).not.toBe(0); // Different random parts
    });

    it('should sort ULIDs chronologically by timestamp', () => {
      const timestamps = [3000, 1000, 2000, 4000];
      const ulids = timestamps.map(ts => UlidGenerator.generateWithTimestamp(ts));
      
      const sorted = ulids.sort((a, b) => UlidGenerator.compare(a, b));
      const sortedTimestamps = sorted.map(ulid => UlidGenerator.decodeTimestamp(ulid));
      
      expect(sortedTimestamps).toEqual([1000, 2000, 3000, 4000]);
    });
  });

  describe('fromUuid()', () => {
    it('should generate new ULID when given UUID', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const ulid = UlidGenerator.fromUuid(uuid);
      
      expect(UlidGenerator.isValid(ulid)).toBe(true);
    });

    it('should generate different ULIDs for same UUID', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const ulid1 = UlidGenerator.fromUuid(uuid);
      const ulid2 = UlidGenerator.fromUuid(uuid);
      
      // Note: fromUuid generates new ULIDs, doesn't preserve UUID value
      expect(ulid1).not.toBe(ulid2);
    });
  });
});

describe('Convenience functions', () => {
  describe('generateUlid()', () => {
    it('should generate valid ULID', () => {
      const ulid = generateUlid();
      expect(ulid).toHaveLength(26);
      expect(isValidUlid(ulid)).toBe(true);
    });
  });

  describe('generateMonotonicUlid()', () => {
    it('should generate valid monotonic ULID', () => {
      const ulid = generateMonotonicUlid();
      expect(ulid).toHaveLength(26);
      expect(isValidUlid(ulid)).toBe(true);
    });
  });

  describe('isValidUlid()', () => {
    it('should validate ULIDs correctly', () => {
      expect(isValidUlid(generateUlid())).toBe(true);
      expect(isValidUlid('invalid')).toBe(false);
    });
  });

  describe('compareUlids()', () => {
    it('should compare ULIDs correctly', () => {
      const ulid1 = UlidGenerator.generateWithTimestamp(1000);
      const ulid2 = UlidGenerator.generateWithTimestamp(2000);
      
      expect(compareUlids(ulid1, ulid2)).toBe(-1);
      expect(compareUlids(ulid2, ulid1)).toBe(1);
    });
  });
});

describe('Performance and reliability', () => {
  it('should generate many ULIDs quickly', () => {
    const startTime = Date.now();
    const ulids: string[] = [];
    
    for (let i = 0; i < 1000; i++) {
      ulids.push(generateUlid());
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should generate 1000 ULIDs in under 1 second
    expect(duration).toBeLessThan(1000);
    
    // All should be valid
    expect(ulids.every(ulid => isValidUlid(ulid))).toBe(true);
    
    // All should be unique
    const uniqueUlids = new Set(ulids);
    expect(uniqueUlids.size).toBe(1000);
  });

  it('should handle rapid generation without collision', () => {
    const ulids: string[] = [];
    
    // Generate many ULIDs in quick succession
    for (let i = 0; i < 100; i++) {
      ulids.push(generateMonotonicUlid());
    }
    
    // All should be unique
    const uniqueUlids = new Set(ulids);
    expect(uniqueUlids.size).toBe(100);
    
    // All should be in order (monotonic)
    const sorted = [...ulids].sort();
    expect(ulids).toEqual(sorted);
  });

  it('should maintain sortability across time', () => {
    const batch1 = Array.from({ length: 10 }, () => generateUlid());
    
    // Wait a bit
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const batch2 = Array.from({ length: 10 }, () => generateUlid());
        
        // All batch2 ULIDs should be greater than all batch1 ULIDs
        batch1.forEach(ulid1 => {
          batch2.forEach(ulid2 => {
            expect(compareUlids(ulid1, ulid2)).toBe(-1);
          });
        });
        
        resolve();
      }, 10); // Small delay to ensure different timestamps
    });
  }, 1000);
});