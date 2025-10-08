import { ulid, monotonicFactory, decodeTime } from 'ulid';

export type ULIDString = string & { readonly brand: unique symbol };

const monotonicUlidGenerator = monotonicFactory();

export class UlidGenerator {
  /**
   * Generate a standard ULID
   * @returns A new ULID string
   */
  static generate(): ULIDString {
    return ulid() as ULIDString;
  }

  /**
   * Generate a monotonic ULID (guaranteed to be lexicographically sortable)
   * Monotonic ULIDs are useful for maintaining strict ordering even when
   * multiple ULIDs are generated within the same millisecond
   * @returns A new monotonic ULID string
   */
  static generateMonotonic(): ULIDString {
    return monotonicUlidGenerator() as ULIDString;
  }

  /**
   * Generate a ULID with a specific timestamp
   * @param timestamp - Unix timestamp in milliseconds
   * @returns A new ULID string with the specified timestamp
   */
  static generateWithTimestamp(timestamp: number): ULIDString {
    return ulid(timestamp) as ULIDString;
  }

  /**
   * Validate if a string is a valid ULID
   * @param value - The string to validate
   * @returns true if the string is a valid ULID
   */
  static isValid(value: string): value is ULIDString {
    // ULID format: 26 characters, Crockford's base32
    const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;

    if (!ulidRegex.test(value)) {
      return false;
    }

    try {
      // Additional validation: timestamp should be valid
      const timestamp = decodeTime(value);
      return timestamp >= 0 && timestamp <= Date.now() + 86400000; // Allow 1 day in future
    } catch {
      return false;
    }
  }

  /**
   * Extract the timestamp from a ULID
   * @param ulidStr - The ULID string
   * @returns Unix timestamp in milliseconds
   */
  static decodeTimestamp(ulidStr: string): number {
    if (!this.isValidFormat(ulidStr)) {
      throw new Error('Invalid ULID format');
    }

    return decodeTime(ulidStr);
  }

  /**
   * Get the creation date from a ULID
   * @param ulidStr - The ULID string
   * @returns Date object representing the creation time
   */
  static getDate(ulidStr: string): Date {
    const timestamp = this.decodeTimestamp(ulidStr);
    return new Date(timestamp);
  }

  /**
   * Compare two ULIDs for sorting
   * @param a - First ULID
   * @param b - Second ULID
   * @returns -1 if a < b, 0 if a === b, 1 if a > b
   */
  static compare(a: ULIDString, b: ULIDString): -1 | 0 | 1 {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  /**
   * Create a ULID from a UUID (for migration purposes)
   * Note: This generates a new ULID and doesn't preserve the UUID value
   * @param _uuid - UUID string (ignored, used for migration context)
   * @returns A new ULID
   */
  static fromUuid(_uuid: string): ULIDString {
    return this.generate();
  }

  /**
   * Check if string matches ULID format (basic format check)
   * @param value - String to check
   * @returns true if format matches ULID pattern
   */
  private static isValidFormat(value: string): boolean {
    return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(value);
  }
}

// Convenience functions for common use cases
export const generateUlid = UlidGenerator.generate;
export const generateMonotonicUlid = UlidGenerator.generateMonotonic;
export const isValidUlid = UlidGenerator.isValid;
export const compareUlids = UlidGenerator.compare;

// Export the ULID type for use in other modules
export { ULIDString as ULID };
