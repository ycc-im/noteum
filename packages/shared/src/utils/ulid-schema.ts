import { z } from 'zod';
import { UlidGenerator } from './ulid';

/**
 * Zod schema for ULID validation
 * Validates that a string is a valid ULID format (26 characters, Crockford's base32)
 */
export const ulidSchema = z.string().refine(
  (value) => UlidGenerator.isValid(value),
  {
    message: 'Invalid ULID format. Expected 26-character string using Crockford\'s base32 alphabet.',
  }
);

/**
 * Zod schema for optional ULID validation
 */
export const optionalUlidSchema = z.string().refine(
  (value) => value === undefined || value === null || UlidGenerator.isValid(value),
  {
    message: 'Invalid ULID format. Expected 26-character string using Crockford\'s base32 alphabet.',
  }
).optional();

/**
 * Transform schema that converts UUID strings to ULID for migration purposes
 * This can be used during migration to accept either UUID or ULID and convert to ULID
 */
export const uuidToUlidSchema = z.string().refine(
  (value) => {
    // Check if it's already a ULID or a UUID
    if (UlidGenerator.isValid(value)) {
      return true;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },
  {
    message: 'Value must be either a valid UUID or ULID',
  }
).transform((value) => {
  // If it's already a ULID, return it
  if (UlidGenerator.isValid(value)) {
    return value;
  }
  
  // If it's a UUID, generate a new ULID (for migration scenarios)
  return UlidGenerator.fromUuid(value);
});

/**
 * Array of ULIDs schema
 */
export const ulidArraySchema = z.array(ulidSchema);

/**
 * Optional array of ULIDs schema
 */
export const optionalUlidArraySchema = z.array(ulidSchema).optional();

/**
 * Convenience function to create ULID validation with custom error message
 */
export const createUlidSchema = (fieldName?: string) => {
  const message = fieldName 
    ? `Invalid ULID format for ${fieldName}. Expected 26-character string using Crockford's base32 alphabet.`
    : 'Invalid ULID format. Expected 26-character string using Crockford\'s base32 alphabet.';
    
  return z.string().refine(
    (value) => UlidGenerator.isValid(value),
    { message }
  );
};

/**
 * Schema for bulk ULID operations
 */
export const bulkUlidSchema = z.object({
  ids: ulidArraySchema.min(1).max(100),
});

/**
 * Schema for ULID with timestamp validation
 */
export const ulidWithTimestampSchema = z.string().refine(
  (value) => {
    if (!UlidGenerator.isValid(value)) {
      return false;
    }
    
    try {
      const timestamp = UlidGenerator.decodeTimestamp(value);
      // Check if timestamp is reasonable (not in far future)
      return timestamp <= Date.now() + 24 * 60 * 60 * 1000; // Allow 1 day in future
    } catch {
      return false;
    }
  },
  {
    message: 'Invalid ULID or timestamp is too far in the future.',
  }
);

export default ulidSchema;