import { useEffect, useRef, useState } from 'react';

interface UseAdRotatorOptions {
  intervalMs?: number;
  enabled?: boolean;
  pauseOnHidden?: boolean;
}

export function useAdRotator(slotIds: string[] = [], options: UseAdRotatorOptions = {}) {
  const { intervalMs = 3000, enabled = true, pauseOnHidden = true } = options;

  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || slotIds.length <= 1) return;

    const start = () => {
      stop();
      timerRef.current = window.setInterval(() => {
        setActiveIndex((i) => (i + 1) % slotIds.length);
      }, intervalMs) as unknown as number;
    };

    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (!pauseOnHidden) return;
      document.hidden ? stop() : start();
    };

    start();

    if (pauseOnHidden) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      stop();
      if (pauseOnHidden) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [slotIds.length, intervalMs, enabled, pauseOnHidden]);

  return {
    activeSlotId: slotIds[activeIndex],
    activeIndex,
    isActive: (slotId: string) => slotIds[activeIndex] === slotId
  };
}

export default useAdRotator;
