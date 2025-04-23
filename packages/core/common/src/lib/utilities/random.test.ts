import { describe, expect, it } from 'vitest';
import { generateUUID, getRandomValues, isValidUUID } from './random';

describe('random utilities', () => {
  describe('getRandomValues', () => {
    it('should return a random unsigned 32-bit integer', () => {
      const value = getRandomValues();
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(2 ** 32 - 1);
    });
  });

  describe('generateUUID', () => {
    it('should generate a valid UUID', () => {
      const uuid = generateUUID();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('isValidUUID', () => {
    it.skip('should return true for a valid UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(isValidUUID(uuid)).toBe(true);
    });

    it('should return false for an invalid UUID', () => {
      const invalidUUID = 'invalid-uuid';
      expect(isValidUUID(invalidUUID)).toBe(false);
    });

    it('should return false for a non-string input', () => {
      expect(isValidUUID(12345)).toBe(false);
      expect(isValidUUID(null)).toBe(false);
      expect(isValidUUID(undefined)).toBe(false);
    });

    it('should return false for a string that is not a UUID', () => {
      const notAUUID = '1234567890abcdef';
      expect(isValidUUID(notAUUID)).toBe(false);
    });
  });
});
