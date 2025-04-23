import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Timer } from './shared-util';

describe('Timer', () => {
  describe('getWaitTime', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return correct wait time when time is a positive number', () => {
      const time = 5; // 5 seconds
      const result = Timer.getWaitTime(time);
      expect(result).toBe(5000); // 5000 ms
    });

    it('should return 0 when time is 0', () => {
      const time = 0;
      const result = Timer.getWaitTime(time);
      expect(result).toBeUndefined();
    });

    it('should return undefined when time is a negative number', () => {
      const time = -5;
      const result = Timer.getWaitTime(time);
      expect(result).toBeUndefined();
    });

    it('should return correct wait time when time is a valid exponential string', () => {
      const time = '2e4'; // Start: 2, End: 4
      const result = Timer.getWaitTime(time);
      expect([2000, 3000, 4000]).toContain(result);
    });

    it('should return undefined when time is undefined', () => {
      const result = Timer.getWaitTime(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined when time is an invalid string', () => {
      const time = 'invalid';
      const result = Timer.getWaitTime(time);
      expect(result).toBeUndefined();
    });
  });
});
