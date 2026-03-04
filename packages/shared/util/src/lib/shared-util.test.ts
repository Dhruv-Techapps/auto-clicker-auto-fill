import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Timer } from './shared-util';

describe('Timer', () => {
  describe('getWaitTime', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return correct wait time when time is a positive number', () => {
      const result = Timer.getWaitTime(5);
      expect(result).toBe(5000);
    });

    it('should return undefined when time is 0', () => {
      expect(Timer.getWaitTime(0)).toBeUndefined();
    });

    it('should return undefined when time is a negative number', () => {
      expect(Timer.getWaitTime(-5)).toBeUndefined();
    });

    it('should return undefined when time is undefined', () => {
      expect(Timer.getWaitTime(undefined)).toBeUndefined();
    });

    // ── range (from / to) ────────────────────────────────────────────────────

    it('should return a value in [from*1000, to*1000) when both time and to are positive', () => {
      const result = Timer.getWaitTime(2, 4);
      expect(result).toBeGreaterThanOrEqual(2000);
      expect(result).toBeLessThan(4000);
    });

    it('should return only time*1000 when to is 0', () => {
      expect(Timer.getWaitTime(3, 0)).toBe(3000);
    });

    it('should return only time*1000 when to is negative', () => {
      expect(Timer.getWaitTime(3, -1)).toBe(3000);
    });

    it('should return only time*1000 when to equals time', () => {
      // range is 0 wide – Math.floor(random * 0) + time = time
      expect(Timer.getWaitTime(2, 2)).toBe(2000);
    });

    it('should respect randomness across multiple calls for a valid range', () => {
      const results = new Set(Array.from({ length: 50 }, () => Timer.getWaitTime(1, 5)));
      // With 4 possible buckets and 50 draws, almost certainly >1 distinct value
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('getTimeAndSleep', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should resolve immediately when time is 0', async () => {
      const promise = Timer.getTimeAndSleep(0);
      await vi.runAllTimersAsync();
      await expect(promise).resolves.toBeUndefined();
    });

    it('should sleep for time*1000 ms when only time is given', async () => {
      const spy = vi.spyOn(globalThis, 'setTimeout');
      const promise = Timer.getTimeAndSleep(3);
      await vi.runAllTimersAsync();
      await promise;
      expect(spy).toHaveBeenCalledWith(expect.any(Function), 3000);
    });

    it('should sleep for a value in [from*1000, to*1000) when both time and to are given', async () => {
      const spy = vi.spyOn(globalThis, 'setTimeout');
      const promise = Timer.getTimeAndSleep(2, 4);
      await vi.runAllTimersAsync();
      await promise;
      const sleepMs = spy.mock.calls[0][1] as number;
      expect(sleepMs).toBeGreaterThanOrEqual(2000);
      expect(sleepMs).toBeLessThan(4000);
    });

    it('should resolve immediately when time is undefined', async () => {
      const spy = vi.spyOn(globalThis, 'setTimeout');
      const promise = Timer.getTimeAndSleep(undefined);
      await vi.runAllTimersAsync();
      await promise;
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
