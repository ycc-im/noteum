import { UlidUtil } from '../ulid.util'

describe('UlidUtil', () => {
  describe('generate', () => {
    it('should generate a valid ULID', () => {
      const ulid = UlidUtil.generate()
      expect(ulid).toHaveLength(26)
      expect(UlidUtil.isValid(ulid)).toBe(true)
    })

    it('should generate unique ULIDs', () => {
      const ulid1 = UlidUtil.generate()
      const ulid2 = UlidUtil.generate()
      expect(ulid1).not.toBe(ulid2)
    })
  })

  describe('isValid', () => {
    it('should validate correct ULID format', () => {
      const validUlid = UlidUtil.generate()
      expect(UlidUtil.isValid(validUlid)).toBe(true)
    })

    it('should reject invalid ULID format', () => {
      const invalidUlid = 'invalid-ulid'
      expect(UlidUtil.isValid(invalidUlid)).toBe(false)
    })

    it('should reject empty string', () => {
      expect(UlidUtil.isValid('')).toBe(false)
    })

    it('should reject null/undefined', () => {
      expect(UlidUtil.isValid(null as any)).toBe(false)
      expect(UlidUtil.isValid(undefined as any)).toBe(false)
    })
  })

  describe('decodeTime', () => {
    it('should decode timestamp from ULID', () => {
      const timestamp = Date.now()
      const ulid = UlidUtil.fromTime(timestamp)
      const decoded = UlidUtil.decodeTime(ulid)
      expect(decoded).toBeCloseTo(timestamp, -3) // 精确到秒级
    })
  })

  describe('fromTime', () => {
    it('should create ULID from timestamp', () => {
      const timestamp = Date.now()
      const ulid = UlidUtil.fromTime(timestamp)
      expect(UlidUtil.isValid(ulid)).toBe(true)
      expect(UlidUtil.decodeTime(ulid)).toBeCloseTo(timestamp, -3)
    })
  })

  describe('compare', () => {
    it('should compare ULIDs chronologically', () => {
      const earlier = UlidUtil.fromTime(Date.now() - 1000)
      const later = UlidUtil.fromTime(Date.now())

      expect(UlidUtil.compare(earlier, later)).toBeLessThan(0)
      expect(UlidUtil.compare(later, earlier)).toBeGreaterThan(0)
      expect(UlidUtil.compare(earlier, earlier)).toBe(0)
    })
  })

  describe('createdAt', () => {
    it('should return creation date', () => {
      const timestamp = Date.now()
      const ulid = UlidUtil.fromTime(timestamp)
      const createdDate = UlidUtil.createdAt(ulid)
      expect(createdDate.getTime()).toBeCloseTo(timestamp, -3)
    })
  })

  describe('generateTestUlid', () => {
    it('should generate test ULIDs', () => {
      const testUlid = UlidUtil.generateTestUlid()
      expect(UlidUtil.isValid(testUlid)).toBe(true)
    })

    it('should generate different ULIDs for different seeds', () => {
      const testUlid1 = UlidUtil.generateTestUlid(1)
      const testUlid2 = UlidUtil.generateTestUlid(2)
      expect(testUlid1).not.toBe(testUlid2)
    })
  })
})
