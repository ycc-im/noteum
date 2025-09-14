import { 
  generateUlid, 
  generateMonotonicUlid, 
  isValidUlid, 
  compareUlids, 
  UlidGenerator,
  ULID
} from '../utils/ulid';
import {
  ulidSchema,
  ulidArraySchema,
  bulkUlidSchema
} from '../utils/ulid-schema';
import { z } from 'zod';

describe('ULID Integration Tests - Complete CRUD Flow', () => {
  describe('Database-like Operations', () => {
    // Simulate database table with ULID primary keys
    interface MockUser {
      id: string;
      email: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }

    interface MockNote {
      id: string;
      userId: string;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    }

    let mockUsersTable: MockUser[] = [];
    let mockNotesTable: MockNote[] = [];

    beforeEach(() => {
      // Reset mock tables
      mockUsersTable = [];
      mockNotesTable = [];
    });

    it('should perform complete User CRUD operations with ULIDs', () => {
      // CREATE - Insert user with ULID
      const userId = generateUlid();
      expect(isValidUlid(userId)).toBe(true);
      
      const newUser: MockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockUsersTable.push(newUser);
      expect(mockUsersTable).toHaveLength(1);
      
      // READ - Find user by ULID
      const foundUser = mockUsersTable.find(user => user.id === userId);
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(userId);
      expect(foundUser?.email).toBe('test@example.com');
      
      // UPDATE - Update user with ULID
      const updatedUser = mockUsersTable.find(user => user.id === userId);
      if (updatedUser) {
        updatedUser.name = 'Updated User';
        updatedUser.updatedAt = new Date();
      }
      
      const updatedFoundUser = mockUsersTable.find(user => user.id === userId);
      expect(updatedFoundUser?.name).toBe('Updated User');
      
      // DELETE - Remove user by ULID
      const initialLength = mockUsersTable.length;
      mockUsersTable = mockUsersTable.filter(user => user.id !== userId);
      expect(mockUsersTable).toHaveLength(initialLength - 1);
    });

    it('should handle relationships between entities using ULIDs', async () => {
      // Create user
      const userId = generateUlid();
      const user: MockUser = {
        id: userId,
        email: 'author@example.com',
        name: 'Author',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersTable.push(user);
      
      // Create multiple notes for the user
      const noteIds: string[] = [];
      for (let i = 0; i < 5; i++) {
        const noteId = generateMonotonicUlid(); // Use monotonic for guaranteed ordering
        noteIds.push(noteId);
        
        const note: MockNote = {
          id: noteId,
          userId: userId, // Foreign key relationship
          title: `Note ${i + 1}`,
          content: `Content for note ${i + 1}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockNotesTable.push(note);
        
        // Small delay to ensure timestamp differences
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      // Verify relationships
      const userNotes = mockNotesTable.filter(note => note.userId === userId);
      expect(userNotes).toHaveLength(5);
      
      // Verify ULID ordering (monotonic ULIDs should be in order)
      const sortedNoteIds = [...noteIds].sort();
      expect(noteIds).toEqual(sortedNoteIds);
      
      // Test querying notes by user ID
      const foundUser = mockUsersTable.find(u => u.id === userId);
      expect(foundUser).toBeDefined();
      
      const foundNotes = mockNotesTable.filter(n => n.userId === foundUser!.id);
      expect(foundNotes).toHaveLength(5);
      expect(foundNotes.every(note => isValidUlid(note.id))).toBe(true);
      expect(foundNotes.every(note => isValidUlid(note.userId))).toBe(true);
    });

    it('should perform bulk operations with ULID validation', () => {
      // Generate multiple ULIDs for bulk insert
      const userCount = 10;
      const userIds = Array.from({ length: userCount }, () => generateUlid());
      
      // Validate bulk ULID schema
      const bulkData = { ids: userIds };
      const validationResult = bulkUlidSchema.safeParse(bulkData);
      expect(validationResult.success).toBe(true);
      
      // Bulk insert users
      const users: MockUser[] = userIds.map((id, index) => ({
        id,
        email: `user${index}@example.com`,
        name: `User ${index}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      mockUsersTable.push(...users);
      expect(mockUsersTable).toHaveLength(userCount);
      
      // Bulk read operation
      const foundUsers = mockUsersTable.filter(user => userIds.includes(user.id as any));
      expect(foundUsers).toHaveLength(userCount);
      
      // Validate all ULIDs
      expect(foundUsers.every(user => isValidUlid(user.id))).toBe(true);
      
      // Bulk delete
      mockUsersTable = mockUsersTable.filter(user => !userIds.includes(user.id as any));
      expect(mockUsersTable).toHaveLength(0);
    });
  });

  describe('API Request/Response Simulation', () => {
    // Simulate API request/response with ULID validation
    const UserRequestSchema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
    });

    const UserResponseSchema = z.object({
      id: ulidSchema,
      email: z.string().email(),
      name: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    });

    const CreateNoteRequestSchema = z.object({
      userId: ulidSchema,
      title: z.string().min(1),
      content: z.string(),
    });

    const NoteResponseSchema = z.object({
      id: ulidSchema,
      userId: ulidSchema,
      title: z.string(),
      content: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    });

    it('should validate API requests and responses with ULIDs', () => {
      // Simulate POST /users request
      const createUserRequest = {
        email: 'api@example.com',
        name: 'API User',
      };
      
      const requestValidation = UserRequestSchema.safeParse(createUserRequest);
      expect(requestValidation.success).toBe(true);
      
      // Simulate response with generated ULID
      const userResponse = {
        id: generateUlid(),
        email: createUserRequest.email,
        name: createUserRequest.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const responseValidation = UserResponseSchema.safeParse(userResponse);
      expect(responseValidation.success).toBe(true);
      
      if (responseValidation.success) {
        expect(isValidUlid(responseValidation.data.id as string)).toBe(true);
      }
    });

    it('should handle nested resource creation with ULID relationships', () => {
      const userId = generateUlid();
      
      // Create note for user
      const createNoteRequest = {
        userId: userId,
        title: 'API Test Note',
        content: 'This note was created via API',
      };
      
      const requestValidation = CreateNoteRequestSchema.safeParse(createNoteRequest);
      expect(requestValidation.success).toBe(true);
      
      // Simulate note creation response
      const noteResponse = {
        id: generateUlid(),
        userId: createNoteRequest.userId,
        title: createNoteRequest.title,
        content: createNoteRequest.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const responseValidation = NoteResponseSchema.safeParse(noteResponse);
      expect(responseValidation.success).toBe(true);
      
      if (responseValidation.success) {
        expect(isValidUlid(responseValidation.data.id as string)).toBe(true);
        expect(isValidUlid(responseValidation.data.userId as string)).toBe(true);
        expect(responseValidation.data.userId).toBe(userId);
      }
    });

    it('should reject invalid ULIDs in API requests', () => {
      const invalidRequests = [
        {
          userId: 'invalid-ulid',
          title: 'Test Note',
          content: 'Content',
        },
        {
          userId: '01AN4Z07BY79KA1307SR9X4MV3X', // Too long
          title: 'Test Note',
          content: 'Content',
        },
        {
          userId: '01AN4Z07BY79KA1307SR9X4MVI', // Contains 'I'
          title: 'Test Note',
          content: 'Content',
        },
      ];

      invalidRequests.forEach(request => {
        const validation = CreateNoteRequestSchema.safeParse(request);
        expect(validation.success).toBe(false);
        if (!validation.success) {
          expect(validation.error.issues.some(issue => 
            issue.path.includes('userId') && issue.message.includes('Invalid ULID format')
          )).toBe(true);
        }
      });
    });
  });

  describe('Performance and Sorting Characteristics', () => {
    it('should demonstrate ULID sorting performance benefits', () => {
      const recordCount = 1000;
      const startTime = Date.now();
      
      // Generate many ULIDs rapidly
      const ulids: string[] = [];
      for (let i = 0; i < recordCount; i++) {
        ulids.push(generateMonotonicUlid());
      }
      
      const generateTime = Date.now() - startTime;
      expect(generateTime).toBeLessThan(1000); // Should be fast
      
      // Verify all are valid
      expect(ulids.every(ulid => isValidUlid(ulid))).toBe(true);
      
      // Verify natural ordering (monotonic ULIDs should already be sorted)
      const sortedUlids = [...ulids].sort();
      expect(ulids).toEqual(sortedUlids);
      
      // Test sorting performance
      const sortStartTime = Date.now();
      const reSorted = [...ulids].sort((a, b) => compareUlids(a as ULID, b as ULID));
      const sortTime = Date.now() - sortStartTime;
      
      expect(sortTime).toBeLessThan(100); // Sorting should be very fast
      expect(reSorted).toEqual(ulids); // Should maintain order
    });

    it('should demonstrate timestamp-based queries', () => {
      // Create ULIDs at different times
      const batch1Timestamp = Date.now() - 10000; // 10 seconds ago
      const batch2Timestamp = Date.now() - 5000;  // 5 seconds ago
      const batch3Timestamp = Date.now();         // Now
      
      const batch1Ulids = [
        UlidGenerator.generateWithTimestamp(batch1Timestamp),
        UlidGenerator.generateWithTimestamp(batch1Timestamp + 100),
        UlidGenerator.generateWithTimestamp(batch1Timestamp + 200),
      ];
      
      const batch2Ulids = [
        UlidGenerator.generateWithTimestamp(batch2Timestamp),
        UlidGenerator.generateWithTimestamp(batch2Timestamp + 100),
      ];
      
      const batch3Ulids = [
        UlidGenerator.generateWithTimestamp(batch3Timestamp),
      ];
      
      const allUlids = [...batch1Ulids, ...batch2Ulids, ...batch3Ulids];
      
      // Verify timestamp extraction
      batch1Ulids.forEach(ulid => {
        const extracted = UlidGenerator.decodeTimestamp(ulid);
        expect(extracted).toBeGreaterThanOrEqual(batch1Timestamp);
        expect(extracted).toBeLessThan(batch1Timestamp + 1000);
      });
      
      // Test range queries (simulate database WHERE created_at BETWEEN)
      const fiveSecondsAgo = Date.now() - 6000; // Use 6 seconds to ensure we include batch2
      const recentUlids = allUlids.filter(ulid => {
        const timestamp = UlidGenerator.decodeTimestamp(ulid);
        return timestamp >= fiveSecondsAgo;
      });
      
      // Should include at least batch2 and batch3
      expect(recentUlids.length).toBeGreaterThanOrEqual(batch2Ulids.length + batch3Ulids.length);
      
      // Verify lexicographic sorting equals timestamp sorting
      const lexicographicallySorted = [...allUlids].sort();
      const timestampSorted = [...allUlids].sort((a, b) => {
        const timeA = UlidGenerator.decodeTimestamp(a);
        const timeB = UlidGenerator.decodeTimestamp(b);
        return timeA - timeB;
      });
      
      expect(lexicographicallySorted).toEqual(timestampSorted);
    });
  });

  describe('Migration and Compatibility', () => {
    it('should handle UUID to ULID migration scenarios', () => {
      // Simulate existing UUID data
      const existingUuids = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      ];
      
      // Map UUIDs to new ULIDs (in real scenario, this would be done in migration)
      const uuidToUlidMap = new Map<string, string>();
      existingUuids.forEach(uuid => {
        const newUlid = generateUlid();
        uuidToUlidMap.set(uuid, newUlid);
      });
      
      // Verify all new ULIDs are valid
      Array.from(uuidToUlidMap.values()).forEach(ulid => {
        expect(isValidUlid(ulid)).toBe(true);
      });
      
      // Test lookup performance
      const lookupStartTime = Date.now();
      existingUuids.forEach(uuid => {
        const ulid = uuidToUlidMap.get(uuid);
        expect(ulid).toBeDefined();
        expect(isValidUlid(ulid!)).toBe(true);
      });
      const lookupTime = Date.now() - lookupStartTime;
      
      expect(lookupTime).toBeLessThan(10); // Should be instant
    });

    it('should validate mixed ID scenarios during migration', () => {
      // During migration, system might have both UUIDs and ULIDs
      const mixedIds = [
        generateUlid(),                                    // New ULID
        '550e8400-e29b-41d4-a716-446655440000',          // Old UUID
        generateUlid(),                                    // New ULID
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',          // Old UUID
      ];
      
      // Separate ULIDs from UUIDs
      const ulids = mixedIds.filter(id => isValidUlid(id));
      const uuids = mixedIds.filter(id => !isValidUlid(id));
      
      expect(ulids).toHaveLength(2);
      expect(uuids).toHaveLength(2);
      
      // Validate ULID array
      const ulidValidation = ulidArraySchema.safeParse(ulids);
      expect(ulidValidation.success).toBe(true);
      
      // UUIDs should fail ULID validation
      const mixedValidation = ulidArraySchema.safeParse(mixedIds);
      expect(mixedValidation.success).toBe(false);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle concurrent ULID generation', async () => {
      const concurrentTasks = 100;
      const promises: Promise<string>[] = [];
      
      // Generate ULIDs concurrently
      for (let i = 0; i < concurrentTasks; i++) {
        promises.push(Promise.resolve(generateMonotonicUlid()));
      }
      
      const results = await Promise.all(promises);
      
      // All should be valid
      expect(results.every(ulid => isValidUlid(ulid))).toBe(true);
      
      // All should be unique
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBe(concurrentTasks);
      
      // Should maintain monotonic ordering
      const sorted = [...results].sort();
      expect(results).toEqual(sorted);
    });

    it('should handle invalid data gracefully', () => {
      const invalidInputs = [
        null,
        undefined,
        123,
        [],
        {},
        '',
        'invalid',
        '01AN4Z07BY79KA1307SR9X4MVIX', // Invalid character
      ];

      invalidInputs.forEach(input => {
        expect(isValidUlid(input as any)).toBe(false);
        
        const schemaResult = ulidSchema.safeParse(input);
        expect(schemaResult.success).toBe(false);
      });
    });
  });
});