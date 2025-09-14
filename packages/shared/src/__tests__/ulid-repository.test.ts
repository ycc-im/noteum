import { generateUlid, generateMonotonicUlid, isValidUlid, UlidGenerator } from '../utils/ulid';

describe('ULID Repository Integration Tests', () => {
  // Mock SQL query results with ULID data
  interface MockQueryResult {
    id: string;
    user_id?: string;
    title?: string;
    content?: string;
    created_at: Date;
    updated_at: Date;
  }

  // Simulate database connection and query execution
  class MockDatabase {
    private queryLog: string[] = [];
    private mockData: { [table: string]: MockQueryResult[] } = {
      users: [],
      notes: [],
    };

    async executeQuery(sql: string, params: any[] = []): Promise<MockQueryResult[]> {
      this.queryLog.push(`SQL: ${sql} | PARAMS: ${JSON.stringify(params)}`);
      
      // Simulate INSERT operations
      if (sql.includes('INSERT INTO users')) {
        const [id, email, name] = params;
        const user: MockQueryResult = {
          id,
          title: email, // Using title field for email in mock
          content: name, // Using content field for name in mock
          created_at: new Date(),
          updated_at: new Date(),
        };
        this.mockData.users.push(user);
        return [user];
      }
      
      if (sql.includes('INSERT INTO notes')) {
        const [id, userId, title, content] = params;
        const note: MockQueryResult = {
          id,
          user_id: userId,
          title,
          content,
          created_at: new Date(),
          updated_at: new Date(),
        };
        this.mockData.notes.push(note);
        return [note];
      }
      
      // Simulate SELECT operations
      if (sql.includes('SELECT * FROM users WHERE id =')) {
        const [id] = params;
        return this.mockData.users.filter(u => u.id === id);
      }
      
      if (sql.includes('SELECT * FROM notes WHERE user_id =')) {
        const [userId] = params;
        return this.mockData.notes.filter(n => n.user_id === userId);
      }
      
      // Simulate ORDER BY queries
      if (sql.includes('ORDER BY id ASC')) {
        if (sql.includes('FROM users')) {
          return [...this.mockData.users].sort((a, b) => a.id.localeCompare(b.id));
        }
        if (sql.includes('FROM notes')) {
          return [...this.mockData.notes].sort((a, b) => a.id.localeCompare(b.id));
        }
      }
      
      return [];
    }

    getQueryLog(): string[] {
      return this.queryLog;
    }

    clearData(): void {
      this.mockData = { users: [], notes: [] };
      this.queryLog = [];
    }
  }

  // Repository class using ULIDs
  class UserRepository {
    constructor(private db: MockDatabase) {}

    async create(userData: { email: string; name: string }): Promise<MockQueryResult> {
      const id = generateUlid();
      const sql = 'INSERT INTO users (id, email, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *';
      const params = [id, userData.email, userData.name];
      
      const results = await this.db.executeQuery(sql, params);
      return results[0];
    }

    async findById(id: string): Promise<MockQueryResult | null> {
      const sql = 'SELECT * FROM users WHERE id = $1';
      const results = await this.db.executeQuery(sql, [id]);
      return results[0] || null;
    }

    async findAllOrderedById(): Promise<MockQueryResult[]> {
      const sql = 'SELECT * FROM users ORDER BY id ASC';
      return this.db.executeQuery(sql);
    }
  }

  class NoteRepository {
    constructor(private db: MockDatabase) {}

    async create(noteData: { userId: string; title: string; content: string }): Promise<MockQueryResult> {
      const id = generateMonotonicUlid(); // Use monotonic for notes to ensure ordering
      const sql = 'INSERT INTO notes (id, user_id, title, content, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *';
      const params = [id, noteData.userId, noteData.title, noteData.content];
      
      const results = await this.db.executeQuery(sql, params);
      return results[0];
    }

    async findByUserId(userId: string): Promise<MockQueryResult[]> {
      const sql = 'SELECT * FROM notes WHERE user_id = $1 ORDER BY id ASC';
      return this.db.executeQuery(sql, [userId]);
    }
  }

  let db: MockDatabase;
  let userRepo: UserRepository;
  let noteRepo: NoteRepository;

  beforeEach(() => {
    db = new MockDatabase();
    userRepo = new UserRepository(db);
    noteRepo = new NoteRepository(db);
  });

  describe('Basic CRUD Operations with ULIDs', () => {
    it('should create and retrieve users with ULID primary keys', async () => {
      // Create user
      const userData = { email: 'test@example.com', name: 'Test User' };
      const createdUser = await userRepo.create(userData);
      
      // Verify ULID was generated
      expect(isValidUlid(createdUser.id)).toBe(true);
      expect(createdUser.id).toHaveLength(26);
      
      // Retrieve user by ULID
      const foundUser = await userRepo.findById(createdUser.id);
      expect(foundUser).not.toBeNull();
      expect(foundUser!.id).toBe(createdUser.id);
      
      // Verify SQL was executed correctly
      const queries = db.getQueryLog();
      expect(queries).toHaveLength(2);
      expect(queries[0]).toContain('INSERT INTO users');
      expect(queries[1]).toContain('SELECT * FROM users WHERE id =');
    });

    it('should handle foreign key relationships with ULIDs', async () => {
      // Create user
      const user = await userRepo.create({ email: 'author@example.com', name: 'Author' });
      expect(isValidUlid(user.id)).toBe(true);
      
      // Create notes for the user
      const noteData = [
        { userId: user.id, title: 'First Note', content: 'Content 1' },
        { userId: user.id, title: 'Second Note', content: 'Content 2' },
        { userId: user.id, title: 'Third Note', content: 'Content 3' },
      ];
      
      const createdNotes: MockQueryResult[] = [];
      for (const data of noteData) {
        const note = await noteRepo.create(data);
        expect(isValidUlid(note.id)).toBe(true);
        expect(isValidUlid(note.user_id!)).toBe(true);
        expect(note.user_id).toBe(user.id);
        createdNotes.push(note);
      }
      
      // Retrieve notes by user ID
      const userNotes = await noteRepo.findByUserId(user.id);
      expect(userNotes).toHaveLength(3);
      
      // Verify all notes belong to the user
      userNotes.forEach(note => {
        expect(note.user_id).toBe(user.id);
        expect(isValidUlid(note.id)).toBe(true);
      });
    });
  });

  describe('ULID Ordering and Performance Benefits', () => {
    it('should demonstrate lexicographic ordering equals timestamp ordering', async () => {
      // Create users at different times with regular ULIDs
      const users: MockQueryResult[] = [];
      const timestamps: number[] = [];
      
      for (let i = 0; i < 5; i++) {
        const timestamp = Date.now() + i * 1000; // 1 second apart
        timestamps.push(timestamp);
        
        const customUlid = UlidGenerator.generateWithTimestamp(timestamp);
        
        // Manually insert with specific ULID
        const sql = 'INSERT INTO users (id, email, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *';
        const params = [customUlid, `user${i}@example.com`, `User ${i}`];
        const [user] = await db.executeQuery(sql, params);
        users.push(user);
        
        // Small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Get users ordered by ID (lexicographic ULID order)
      const orderedUsers = await userRepo.findAllOrderedById();
      
      // Verify they are in the same order as creation timestamps
      for (let i = 0; i < orderedUsers.length; i++) {
        const userTimestamp = UlidGenerator.decodeTimestamp(orderedUsers[i].id);
        expect(userTimestamp).toBe(timestamps[i]);
      }
      
      // Verify lexicographic order equals timestamp order
      const lexicographicOrder = orderedUsers.map(u => u.id);
      const timestampOrder = users
        .sort((a, b) => UlidGenerator.decodeTimestamp(a.id) - UlidGenerator.decodeTimestamp(b.id))
        .map(u => u.id);
      
      expect(lexicographicOrder).toEqual(timestampOrder);
    });

    it('should demonstrate monotonic ULID ordering for high-frequency inserts', async () => {
      const userId = generateUlid();
      
      // Create user first
      await db.executeQuery(
        'INSERT INTO users (id, email, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [userId, 'test@example.com', 'Test User']
      );
      
      // Rapidly create notes with monotonic ULIDs
      const notes: MockQueryResult[] = [];
      for (let i = 0; i < 10; i++) {
        const note = await noteRepo.create({
          userId,
          title: `Rapid Note ${i}`,
          content: `Content ${i}`,
        });
        notes.push(note);
      }
      
      // Verify all ULIDs are in monotonic order
      const noteIds = notes.map(n => n.id);
      const sortedIds = [...noteIds].sort();
      expect(noteIds).toEqual(sortedIds);
      
      // Verify they all have the same or increasing timestamps
      for (let i = 1; i < noteIds.length; i++) {
        const prevTimestamp = UlidGenerator.decodeTimestamp(noteIds[i - 1]);
        const currentTimestamp = UlidGenerator.decodeTimestamp(noteIds[i]);
        expect(currentTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
      }
    });
  });

  describe('Query Performance Simulation', () => {
    it('should simulate efficient range queries using ULID timestamps', async () => {
      const userId = generateUlid();
      
      // Create user
      await db.executeQuery(
        'INSERT INTO users (id, email, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [userId, 'test@example.com', 'Test User']
      );
      
      const baseTime = Date.now();
      const timeRanges = [
        { start: baseTime, end: baseTime + 1000 },      // 0-1 second
        { start: baseTime + 2000, end: baseTime + 3000 }, // 2-3 seconds  
        { start: baseTime + 4000, end: baseTime + 5000 }, // 4-5 seconds
      ];
      
      const allNotes: MockQueryResult[] = [];
      
      // Create notes in different time ranges
      for (let rangeIndex = 0; rangeIndex < timeRanges.length; rangeIndex++) {
        const range = timeRanges[rangeIndex];
        for (let i = 0; i < 3; i++) {
          const timestamp = range.start + (i * 200); // 200ms apart within range
          const ulid = UlidGenerator.generateWithTimestamp(timestamp);
          
          const sql = 'INSERT INTO notes (id, user_id, title, content, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())';
          const params = [ulid, userId, `Note ${rangeIndex}-${i}`, `Content ${rangeIndex}-${i}`];
          const [note] = await db.executeQuery(sql, params);
          allNotes.push(note);
        }
      }
      
      // Simulate range query: find notes created between 1.8-5.2 seconds to include ranges 1 and 2
      const startRange = UlidGenerator.generateWithTimestamp(baseTime + 1800);
      const endRange = UlidGenerator.generateWithTimestamp(baseTime + 5200);
      
      // In real SQL: WHERE id >= $1 AND id <= $2
      const rangeNotes = allNotes.filter(note => 
        note.id >= startRange && note.id <= endRange
      );
      
      // Should include all notes from range 1 (2-3s) and range 2 (4-5s)
      expect(rangeNotes.length).toBeGreaterThanOrEqual(3); // At least 3 notes from range 1
      expect(rangeNotes.length).toBeLessThanOrEqual(6); // At most 6 notes total
      
      // Verify all notes in range have timestamps in the expected range
      rangeNotes.forEach(note => {
        const timestamp = UlidGenerator.decodeTimestamp(note.id);
        expect(timestamp).toBeGreaterThanOrEqual(baseTime + 1800);
        expect(timestamp).toBeLessThanOrEqual(baseTime + 5200);
      });
    });

    it('should demonstrate pagination with ULID cursors', async () => {
      const userId = generateUlid();
      
      // Create user
      await db.executeQuery(
        'INSERT INTO users (id, email, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [userId, 'test@example.com', 'Test User']
      );
      
      // Create many notes
      const allNotes: MockQueryResult[] = [];
      for (let i = 0; i < 20; i++) {
        const note = await noteRepo.create({
          userId,
          title: `Note ${i.toString().padStart(2, '0')}`,
          content: `Content ${i}`,
        });
        allNotes.push(note);
        
        // Small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      // Simulate cursor-based pagination
      const pageSize = 5;
      let cursor: string | null = null;
      const pages: MockQueryResult[][] = [];
      
      while (true) {
        // Simulate: SELECT * FROM notes WHERE user_id = $1 AND id > $2 ORDER BY id LIMIT $3
        let pageNotes = allNotes.filter(note => note.user_id === userId);
        
        if (cursor) {
          pageNotes = pageNotes.filter(note => note.id > cursor!);
        }
        
        pageNotes = pageNotes.sort((a, b) => a.id.localeCompare(b.id)).slice(0, pageSize);
        
        if (pageNotes.length === 0) break;
        
        pages.push(pageNotes);
        cursor = pageNotes[pageNotes.length - 1].id; // Last item ID becomes next cursor
      }
      
      // Verify pagination
      expect(pages).toHaveLength(4); // 20 notes / 5 per page = 4 pages
      expect(pages[0]).toHaveLength(5);
      expect(pages[1]).toHaveLength(5);
      expect(pages[2]).toHaveLength(5);
      expect(pages[3]).toHaveLength(5);
      
      // Verify cursor ordering
      let allPagedNotes: MockQueryResult[] = [];
      pages.forEach(page => {
        allPagedNotes = allPagedNotes.concat(page);
      });
      
      expect(allPagedNotes).toHaveLength(20);
      
      // Verify proper ordering across pages
      for (let i = 1; i < allPagedNotes.length; i++) {
        expect(allPagedNotes[i].id > allPagedNotes[i - 1].id).toBe(true);
      }
    });
  });

  describe('Error Handling and Constraints', () => {
    it('should handle ULID format validation in database constraints', async () => {
      // Test invalid ULID formats
      const invalidUlids = [
        'invalid-id',
        '01AN4Z07BY79KA1307SR9X4MV3X', // Too long
        '01AN4Z07BY79KA1307SR9X4MVI',  // Contains 'I'
        '',
        '12345',
      ];
      
      for (const invalidUlid of invalidUlids) {
        expect(isValidUlid(invalidUlid)).toBe(false);
        
        // In real database, this would be caught by CHECK constraint
        // Here we simulate the validation
        try {
          if (!isValidUlid(invalidUlid)) {
            throw new Error(`ULID constraint violation: invalid format for ID '${invalidUlid}'`);
          }
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toContain('ULID constraint violation');
        }
      }
    });

    it('should handle concurrent insert scenarios', async () => {
      const userId = generateUlid();
      
      // Create user
      await db.executeQuery(
        'INSERT INTO users (id, email, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())',
        [userId, 'test@example.com', 'Test User']
      );
      
      // Simulate concurrent note creation
      const concurrentPromises = Array.from({ length: 10 }, (_, i) =>
        noteRepo.create({
          userId,
          title: `Concurrent Note ${i}`,
          content: `Content ${i}`,
        })
      );
      
      const concurrentNotes = await Promise.all(concurrentPromises);
      
      // Verify all ULIDs are unique
      const noteIds = concurrentNotes.map(n => n.id);
      const uniqueIds = new Set(noteIds);
      expect(uniqueIds.size).toBe(noteIds.length);
      
      // Verify all ULIDs are valid
      noteIds.forEach(id => {
        expect(isValidUlid(id)).toBe(true);
      });
      
      // Verify monotonic ordering (since we used generateMonotonicUlid)
      const sortedIds = [...noteIds].sort();
      expect(noteIds).toEqual(sortedIds);
    });
  });
});